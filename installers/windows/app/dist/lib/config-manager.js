import fs from 'fs';
import os from 'os';
import path from 'path';
const CONFIG_DIR = path.join(os.homedir(), '.ai-shell');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
export function getConfigPath() {
    return CONFIG_PATH;
}
export function getConfig() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export function saveConfig(config) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
}
export function isAllYes() {
    return getConfig()?.allYes === true;
}
export function setAllYes(value) {
    const config = getConfig() ?? { defaultProvider: 'groq' };
    saveConfig({ ...config, allYes: value });
}
export function hasAnyKey() {
    const config = getConfig();
    return !!(config?.anthropicKey || config?.geminiKey || config?.groqKey);
}
export function getActiveProvider(override) {
    const config = getConfig();
    if (override)
        return override;
    return config?.defaultProvider ?? 'anthropic';
}
