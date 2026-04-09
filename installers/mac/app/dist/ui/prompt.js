import chalk from 'chalk';
import inquirer from 'inquirer';
export async function confirmRun(danger, autoConfirm = false) {
    if (autoConfirm)
        return true;
    if (!danger.isDangerous) {
        const { confirmed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: chalk.bold('Run this command?'),
                default: false,
            },
        ]);
        return confirmed;
    }
    // Dangerous: require typing "yes"
    console.log(chalk.red.bold('  ⚠  This is a dangerous command.'));
    const { confirmation } = await inquirer.prompt([
        {
            type: 'input',
            name: 'confirmation',
            message: chalk.red('Type "yes" to confirm, anything else to cancel:'),
            validate: () => true,
        },
    ]);
    return confirmation.trim().toLowerCase() === 'yes';
}
