import chalk from 'chalk'
import { explainCommand } from '../core/ai.js'
import { getActiveProvider, getConfig } from '../lib/config-manager.js'
import type { Provider } from '../types.js'
import { PROVIDER_LABELS } from '../types.js'
import { renderExplanation } from '../ui/output.js'
import { withSpinner } from '../ui/spinner.js'

export async function runExplain(command: string, providerOverride?: string): Promise<void> {
  const config = getConfig()
  if (!config) {
    console.log(chalk.red('  No config found. Run `ai config` to set up your API keys.'))
    process.exit(1)
  }

  const provider = getActiveProvider(providerOverride) as Provider

  let explanation
  try {
    explanation = await withSpinner(
      `Analyzing via ${PROVIDER_LABELS[provider]}...`,
      () => explainCommand(command, config, provider)
    )
  } catch (err) {
    console.log(chalk.red(`  Error: ${(err as Error).message}`))
    process.exit(1)
  }

  renderExplanation(command, explanation)
}
