import chalk from 'chalk';
import { explainCommand } from '../core/claude.js';
import { getConfig } from '../lib/config-manager.js';
import { renderExplanation } from '../ui/output.js';
import { withSpinner } from '../ui/spinner.js';
export async function runExplain(command) {
    const config = getConfig();
    if (!config?.apiKey) {
        console.log(chalk.red('  No API key found. Run `ai config` to set one.'));
        process.exit(1);
    }
    let explanation;
    try {
        explanation = await withSpinner('Analyzing...', () => explainCommand(command, config.apiKey));
    }
    catch (err) {
        console.log(chalk.red(`  Error: ${err.message}`));
        process.exit(1);
    }
    renderExplanation(command, explanation);
}
