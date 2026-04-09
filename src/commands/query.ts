import chalk from 'chalk'
import { generateCommand } from '../core/ai.js'
import { copyToClipboard } from '../core/clipboard.js'
import { executeCommand } from '../core/runner.js'
import { getActiveProvider, getConfig } from '../lib/config-manager.js'
import { isDangerous } from '../lib/danger.js'
import { addHistoryEntry } from '../lib/history-manager.js'
import type { Provider } from '../types.js'
import { PROVIDER_LABELS } from '../types.js'
import { renderOutput } from '../ui/output.js'
import { confirmRun } from '../ui/prompt.js'
import { withSpinner } from '../ui/spinner.js'

export interface QueryOptions {
  copy: boolean
  provider?: string
}

export async function runQuery(query: string, opts: QueryOptions): Promise<void> {
  const config = getConfig()
  if (!config) {
    console.log(chalk.red('  No config found. Run `ai config` to set up your API keys.'))
    process.exit(1)
  }

  const provider = getActiveProvider(opts.provider) as Provider
  const providerLabel = PROVIDER_LABELS[provider]

  let result
  try {
    result = await withSpinner(`Thinking via ${providerLabel}...`, () =>
      generateCommand(query, config, provider)
    )
  } catch (err) {
    console.log(chalk.red(`  Error: ${(err as Error).message}`))
    process.exit(1)
  }

  const danger = isDangerous(result.command)
  renderOutput(result.command, result.explanation, danger, result.provider, result.model)

  if (opts.copy) {
    try {
      await copyToClipboard(result.command)
      console.log(chalk.green('  ✓ Command copied to clipboard.'))
      console.log()
    } catch (err) {
      console.log(chalk.yellow(`  Could not copy: ${(err as Error).message}`))
    }
    addHistoryEntry({ query, command: result.command, explanation: result.explanation, provider, model: result.model, executed: false })
    return
  }

  const confirmed = await confirmRun(danger)
  console.log()

  if (!confirmed) {
    console.log(chalk.dim('  Cancelled.'))
    console.log()
    addHistoryEntry({ query, command: result.command, explanation: result.explanation, provider, model: result.model, executed: false })
    return
  }

  const exitCode = await executeCommand(result.command).catch((err: Error) => {
    console.log(chalk.red(`\n  Error running command: ${err.message}`))
    return 1
  })

  if (exitCode !== 0) {
    console.log(chalk.red(`\n  Command exited with code ${exitCode}`))
  }

  addHistoryEntry({ query, command: result.command, explanation: result.explanation, provider, model: result.model, executed: true, exitCode })
}
