import chalk from 'chalk';
const MIN_BOX_WIDTH = 44;
const PROVIDER_BADGE = {
    anthropic: chalk.magenta('◆ Claude'),
    gemini: chalk.blue('◆ Gemini'),
    groq: chalk.green('◆ Groq'),
};
function buildBox(text, borderColor) {
    const termWidth = process.stdout.columns || 80;
    const maxContent = termWidth - 6;
    const display = text.length > maxContent ? text.slice(0, maxContent - 1) + '…' : text;
    const width = Math.max(display.length + 4, MIN_BOX_WIDTH);
    const padded = display.padEnd(width - 4);
    const top = borderColor('  ╭' + '─'.repeat(width - 2) + '╮');
    const mid = borderColor('  │') + ' ' + chalk.white.bold(padded) + ' ' + borderColor('│');
    const bot = borderColor('  ╰' + '─'.repeat(width - 2) + '╯');
    return [top, mid, bot].join('\n');
}
export function renderOutput(command, explanation, danger, provider, model) {
    const borderColor = danger.isDangerous ? chalk.red : chalk.cyan;
    console.log();
    console.log(buildBox(command, borderColor));
    console.log();
    console.log('  ' + chalk.gray(explanation));
    if (danger.isDangerous) {
        console.log();
        console.log('  ' + chalk.yellow.bold('⚠  WARNING: This command may be dangerous:'));
        for (const reason of danger.reasons) {
            console.log('  ' + chalk.red('  •') + ' ' + chalk.yellow(reason));
        }
    }
    console.log();
    console.log('  ' + (PROVIDER_BADGE[provider] ?? provider) + chalk.dim(` · ${model}`));
    console.log();
}
export function renderExplanation(command, explanation) {
    const termWidth = process.stdout.columns || 80;
    const maxContent = termWidth - 6;
    const display = command.length > maxContent ? command.slice(0, maxContent - 1) + '…' : command;
    const width = Math.max(display.length + 4, MIN_BOX_WIDTH);
    const padded = display.padEnd(width - 4);
    const top = chalk.cyan('  ╭' + '─'.repeat(width - 2) + '╮');
    const mid = chalk.cyan('  │') + ' ' + chalk.white.bold(padded) + ' ' + chalk.cyan('│');
    const bot = chalk.cyan('  ╰' + '─'.repeat(width - 2) + '╯');
    console.log();
    console.log([top, mid, bot].join('\n'));
    console.log();
    console.log('  ' + chalk.gray(explanation));
    console.log();
}
export function renderHistoryEntry(index, timestamp, query, command, provider) {
    const date = new Date(timestamp).toLocaleString();
    const badge = provider ? ' ' + (PROVIDER_BADGE[provider] ?? '') : '';
    console.log(chalk.dim(`  ${index + 1}. ${date}`) + badge);
    console.log(chalk.white(`     ${query}`));
    console.log(chalk.cyan(`     $ ${command}`));
    console.log();
}
