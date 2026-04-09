import chalk from 'chalk';
import { generateCommand } from '../core/claude.js';
import { copyToClipboard } from '../core/clipboard.js';
import { executeCommand } from '../core/runner.js';
import { getConfig } from '../lib/config-manager.js';
import { isDangerous } from '../lib/danger.js';
import { addHistoryEntry } from '../lib/history-manager.js';
import { renderOutput } from '../ui/output.js';
import { confirmRun } from '../ui/prompt.js';
import { withSpinner } from '../ui/spinner.js';
export async function runQuery(query, opts) {
    const config = getConfig();
    if (!config?.apiKey) {
        console.log(chalk.red('  No API key found. Run `ai config` to set one.'));
        process.exit(1);
    }
    let result;
    try {
        result = await withSpinner('Thinking...', () => generateCommand(query, config.apiKey));
    }
    catch (err) {
        console.log(chalk.red(`  Error: ${err.message}`));
        process.exit(1);
    }
    const danger = isDangerous(result.command);
    renderOutput(result.command, result.explanation, danger);
    if (opts.copy) {
        try {
            await copyToClipboard(result.command);
            console.log(chalk.green('  ✓ Command copied to clipboard.'));
            console.log();
        }
        catch {
            console.log(chalk.yellow('  Could not copy to clipboard. Install xclip or xsel on Linux.'));
        }
        addHistoryEntry({ query, command: result.command, explanation: result.explanation, executed: false });
        return;
    }
    const confirmed = await confirmRun(danger);
    console.log();
    if (!confirmed) {
        console.log(chalk.dim('  Cancelled.'));
        console.log();
        addHistoryEntry({ query, command: result.command, explanation: result.explanation, executed: false });
        return;
    }
    const exitCode = await executeCommand(result.command).catch((err) => {
        console.log(chalk.red(`\n  Error running command: ${err.message}`));
        return 1;
    });
    if (exitCode !== 0) {
        console.log(chalk.red(`\n  Command exited with code ${exitCode}`));
    }
    addHistoryEntry({ query, command: result.command, explanation: result.explanation, executed: true, exitCode });
}
