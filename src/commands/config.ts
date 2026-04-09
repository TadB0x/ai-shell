import chalk from 'chalk'
import inquirer from 'inquirer'
import { getConfig, saveConfig } from '../lib/config-manager.js'
import type { AiShellConfig, Provider } from '../types.js'
import { PROVIDER_LABELS, PROVIDER_MODELS } from '../types.js'

function maskKey(key: string): string {
  return key.slice(0, 8) + '...' + key.slice(-4)
}

export async function runConfig(): Promise<void> {
  const existing: AiShellConfig = getConfig() ?? { defaultProvider: 'anthropic' }

  console.log()
  console.log(chalk.bold('  ai-shell — Provider Configuration'))
  console.log(chalk.dim('  Configure one or more AI providers. Press Enter to keep existing keys.\n'))

  // Show current state
  const providers: Provider[] = ['anthropic', 'gemini', 'groq']
  for (const p of providers) {
    const key = existing[`${p}Key` as keyof AiShellConfig] as string | undefined
    const model = PROVIDER_MODELS[p]
    const status = key ? chalk.green(`✓ set (${maskKey(key)})`) : chalk.dim('not set')
    console.log(`  ${chalk.cyan(PROVIDER_LABELS[p].padEnd(22))} ${status}  ${chalk.dim(model)}`)
  }
  console.log()

  // Ask for each key
  const answers = await inquirer.prompt<{
    anthropicKey: string
    geminiKey: string
    groqKey: string
    defaultProvider: Provider
  }>([
    {
      type: 'password',
      name: 'anthropicKey',
      message: `Anthropic API key ${chalk.dim('(sk-ant-... | Enter to skip)')}:`,
      default: '',
    },
    {
      type: 'password',
      name: 'geminiKey',
      message: `Gemini API key     ${chalk.dim('(AIza...   | Enter to skip)')}:`,
      default: '',
    },
    {
      type: 'password',
      name: 'groqKey',
      message: `Groq API key       ${chalk.dim('(gsk_...   | Enter to skip)')}:`,
      default: '',
    },
    {
      type: 'list',
      name: 'defaultProvider',
      message: 'Default provider:',
      choices: providers.map((p) => ({ name: PROVIDER_LABELS[p], value: p })),
      default: existing.defaultProvider ?? 'anthropic',
    },
  ])

  const updated: AiShellConfig = {
    defaultProvider: answers.defaultProvider,
    anthropicKey: answers.anthropicKey.trim() || existing.anthropicKey,
    geminiKey: answers.geminiKey.trim() || existing.geminiKey,
    groqKey: answers.groqKey.trim() || existing.groqKey,
    maxHistory: existing.maxHistory,
  }

  // Warn if default provider has no key
  const defaultKey = updated[`${updated.defaultProvider}Key` as keyof AiShellConfig]
  if (!defaultKey) {
    console.log()
    console.log(chalk.yellow(`  ⚠  No key set for default provider (${PROVIDER_LABELS[updated.defaultProvider]}).`))
    console.log(chalk.yellow('     Add a key or change the default provider.'))
  }

  saveConfig(updated)

  console.log()
  console.log(chalk.green('  ✓ Config saved to ~/.ai-shell/config.json'))
  console.log(chalk.dim(`  Default provider: ${PROVIDER_LABELS[updated.defaultProvider]}`))
  console.log()
}
