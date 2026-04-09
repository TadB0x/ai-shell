import chalk from 'chalk';
import { explainCommand } from '../core/ai.js';
import { getActiveProvider, getConfig } from '../lib/config-manager.js';
import { PROVIDER_LABELS } from '../types.js';
import { renderExplanation } from '../ui/output.js';
import { withSpinner } from '../ui/spinner.js';
export async function runExplain(command, providerOverride) {
    const config = getConfig();
    if (!config) {
        console.log(chalk.red('  No config found. Run `ai config` to set up your API keys.'));
        process.exit(1);
    }
    const provider = getActiveProvider(providerOverride);
    let explanation;
    try {
        explanation = await withSpinner(`Analyzing via ${PROVIDER_LABELS[provider]}...`, () => explainCommand(command, config, provider));
    }
    catch (err) {
        console.log(chalk.red(`  Error: ${err.message}`));
        process.exit(1);
    }
    renderExplanation(command, explanation);
}
