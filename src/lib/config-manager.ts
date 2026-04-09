import fs from 'fs'
import os from 'os'
import path from 'path'
import type { AiShellConfig, Provider } from '../types.js'

const CONFIG_DIR = path.join(os.homedir(), '.ai-shell')
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json')

export function getConfigPath(): string {
  return CONFIG_PATH
}

export function getConfig(): AiShellConfig | null {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(raw) as AiShellConfig
  } catch {
    return null
  }
}

export function saveConfig(config: AiShellConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 })
}

export function isAllYes(): boolean {
  return getConfig()?.allYes === true
}

export function setAllYes(value: boolean): void {
  const config = getConfig() ?? { defaultProvider: 'groq' as const }
  saveConfig({ ...config, allYes: value })
}

export function hasAnyKey(): boolean {
  const config = getConfig()
  return !!(config?.anthropicKey || config?.geminiKey || config?.groqKey)
}

export function getActiveProvider(override?: string): Provider {
  const config = getConfig()
  if (override) return override as Provider
  return config?.defaultProvider ?? 'anthropic'
}
