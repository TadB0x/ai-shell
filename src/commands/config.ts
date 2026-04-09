import chalk from 'chalk'
import inquirer from 'inquirer'
import { getConfig, saveConfig } from '../lib/config-manager.js'

export async function runConfig(): Promise<void> {
  const existing = getConfig()

  if (existing?.apiKey) {
    const masked = existing.apiKey.slice(0, 10) + '...' + existing.apiKey.slice(-4)
    console.log(chalk.dim(`  Current API key: ${masked}`))
    console.log()
  }

  const { apiKey } = await inquirer.prompt<{ apiKey: string }>([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Anthropic API key:',
      validate: (input: string) => {
        if (!input.trim()) return 'API key cannot be empty'
        if (!input.startsWith('sk-ant-')) return 'Key should start with sk-ant-'
        return true
      },
    },
  ])

  saveConfig({ ...existing, apiKey: apiKey.trim() })
  console.log()
  console.log(chalk.green('  ✓ API key saved to ~/.ai-shell/config.json'))
  console.log(chalk.dim('  Run `ai "your query"` to get started.'))
  console.log()
}
