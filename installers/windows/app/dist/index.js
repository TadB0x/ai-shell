#!/usr/bin/env node
process.removeAllListeners('warning');
import chalk from 'chalk';
import { Command } from 'commander';
import { runConfig } from './commands/config.js';
import { runExplain } from './commands/explain.js';
import { runClearHistory, showHistory } from './commands/history.js';
import { runQuery } from './commands/query.js';
import { isAllYes, setAllYes } from './lib/config-manager.js';
const program = new Command();
program
    .name('ai')
    .description(chalk.cyan('Type plain English. Get a shell command.'))
    .version('1.1.0')
    .argument('[query...]', 'Plain English description of what you want to do')
    .option('-e, --explain <command>', 'Explain what a shell command does')
    .option('-c, --copy', 'Copy command to clipboard instead of running')
    .option('-p, --provider <name>', 'AI provider to use: anthropic | gemini | groq')
    .option('-y, --yes', 'Auto-confirm and run all commands without prompting')
    .option('--all-yes', 'Permanently skip all confirmations for every future command')
    .option('--no-all-yes', 'Turn off permanent auto-confirm')
    .addHelpText('after', `
${chalk.bold('Examples:')}
  ${chalk.cyan('$')} ai "show all files larger than 100mb"
  ${chalk.cyan('$')} ai "kill the process on port 3000"
  ${chalk.cyan('$')} ai "compress all jpg files in this folder" --copy
  ${chalk.cyan('$')} ai "list files" --provider groq
  ${chalk.cyan('$')} ai --explain "find . -name '*.js' -not -path '*/node_modules/*'"
  ${chalk.cyan('$')} ai config
  ${chalk.cyan('$')} ai history
  `)
    .action(async (queryParts, options) => {
    // Handle --all-yes / --no-all-yes toggle
    if (options.allYes === true) {
        setAllYes(true);
        console.log(chalk.green('  ✓ All-yes mode ON — all future commands will run without confirmation.'));
        console.log(chalk.dim('  Run `ai --no-all-yes` to turn it off.'));
        if (queryParts.length === 0 && !options.explain)
            return;
    }
    else if (options.allYes === false) {
        setAllYes(false);
        console.log(chalk.yellow('  ✓ All-yes mode OFF — confirmations restored.'));
        if (queryParts.length === 0 && !options.explain)
            return;
    }
    if (options.explain) {
        await runExplain(options.explain, options.provider);
        return;
    }
    if (queryParts.length === 0) {
        program.help();
        return;
    }
    const autoYes = !!options.yes || isAllYes();
    await runQuery(queryParts.join(' '), { copy: !!options.copy, provider: options.provider, yes: autoYes });
});
program
    .command('config')
    .description('Set API keys and default provider')
    .action(runConfig);
program
    .command('history')
    .description('Show past queries and commands')
    .option('-n <count>', 'Number of entries to show', '20')
    .option('--clear', 'Clear all history')
    .action((opts) => {
    if (opts.clear) {
        runClearHistory();
    }
    else {
        showHistory(parseInt(opts.n));
    }
});
program.parse();
