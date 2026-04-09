import fs from 'fs'
import os from 'os'
import path from 'path'
import type { AiShellConfig } from '../types.js'

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

export function hasApiKey(): boolean {
  const config = getConfig()
  return !!config?.apiKey
}
