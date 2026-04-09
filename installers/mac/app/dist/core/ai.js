import * as anthropic from './providers/anthropic.js';
import * as gemini from './providers/gemini.js';
import * as groq from './providers/groq.js';
function getApiKey(config, provider) {
    const keys = {
        anthropic: config.anthropicKey,
        gemini: config.geminiKey,
        groq: config.groqKey,
    };
    const key = keys[provider];
    if (!key)
        throw new Error(`No API key set for ${provider}. Run \`ai config\` to add it.`);
    return key;
}
export async function generateCommand(query, config, provider) {
    const key = getApiKey(config, provider);
    switch (provider) {
        case 'anthropic': return anthropic.generateCommand(query, key);
        case 'gemini': return gemini.generateCommand(query, key);
        case 'groq': return groq.generateCommand(query, key);
    }
}
export async function explainCommand(command, config, provider) {
    const key = getApiKey(config, provider);
    switch (provider) {
        case 'anthropic': return anthropic.explainCommand(command, key);
        case 'gemini': return gemini.explainCommand(command, key);
        case 'groq': return groq.explainCommand(command, key);
    }
}
