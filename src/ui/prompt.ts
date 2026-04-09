import chalk from 'chalk'
import inquirer from 'inquirer'
import type { DangerResult } from '../types.js'

export async function confirmRun(danger: DangerResult): Promise<boolean> {
  if (!danger.isDangerous) {
    const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
      {
        type: 'confirm',
        name: 'confirmed',
        message: chalk.bold('Run this command?'),
        default: false,
      },
    ])
    return confirmed
  }

  // Dangerous: require typing "yes"
  console.log(chalk.red.bold('  ⚠  This is a dangerous command.'))
  const { confirmation } = await inquirer.prompt<{ confirmation: string }>([
    {
      type: 'input',
      name: 'confirmation',
      message: chalk.red('Type "yes" to confirm, anything else to cancel:'),
      validate: () => true,
    },
  ])
  return confirmation.trim().toLowerCase() === 'yes'
}
