export type Provider = 'anthropic' | 'gemini' | 'groq'

export interface AiShellConfig {
  defaultProvider: Provider
  anthropicKey?: string
  geminiKey?: string
  groqKey?: string
  maxHistory?: number
  allYes?: boolean
}

export interface CommandResult {
  command: string
  explanation: string
  provider: Provider
  model: string
}

export interface HistoryEntry {
  id: string
  timestamp: string
  query: string
  command: string
  explanation: string
  provider: Provider
  model: string
  executed: boolean
  exitCode?: number
}

export interface DangerResult {
  isDangerous: boolean
  reasons: string[]
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: 'Claude (Anthropic)',
  gemini: 'Gemini (Google)',
  groq: 'Groq',
}

export const PROVIDER_MODELS: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5',
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
}
