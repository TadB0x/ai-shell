#!/usr/bin/env node
process.removeAllListeners('warning')
import chalk from 'chalk'
import { Command } from 'commander'
import { runConfig } from './commands/config.js'
import { runExplain } from './commands/explain.js'
import { runClearHistory, showHistory } from './commands/history.js'
import { runQuery } from './commands/query.js'

const program = new Command()

program
  .name('ai')
  .description(chalk.cyan('Type plain English. Get a shell command.'))
  .version('1.0.0')
  .argument('[query...]', 'Plain English description of what you want to do')
  .option('-e, --explain <command>', 'Explain what a shell command does')
  .option('-c, --copy', 'Copy command to clipboard instead of running')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  ${chalk.cyan('$')} ai "show all files larger than 100mb"
  ${chalk.cyan('$')} ai "kill the process on port 3000"
  ${chalk.cyan('$')} ai "compress all jpg files in this folder" --copy
  ${chalk.cyan('$')} ai --explain "find . -name '*.js' -not -path '*/node_modules/*'"
  ${chalk.cyan('$')} ai config
  ${chalk.cyan('$')} ai history
  `)
  .action(async (queryParts: string[], options: { explain?: string; copy?: boolean }) => {
    if (options.explain) {
      await runExplain(options.explain)
      return
    }
    if (queryParts.length === 0) {
      program.help()
      return
    }
    await runQuery(queryParts.join(' '), { copy: !!options.copy })
  })

program
  .command('config')
  .description('Set your Anthropic API key')
  .action(runConfig)

program
  .command('history')
  .description('Show past queries and commands')
  .option('-n <count>', 'Number of entries to show', '20')
  .option('--clear', 'Clear all history')
  .action((opts: { n: string; clear?: boolean }) => {
    if (opts.clear) {
      runClearHistory()
    } else {
      showHistory(parseInt(opts.n))
    }
  })

program.parse()
