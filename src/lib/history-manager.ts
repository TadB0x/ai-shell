import fs from 'fs'
import os from 'os'
import path from 'path'
import type { HistoryEntry } from '../types.js'

const HISTORY_DIR = path.join(os.homedir(), '.ai-shell')
const HISTORY_PATH = path.join(HISTORY_DIR, 'history.json')
const MAX_ENTRIES = 500

export function getHistory(): HistoryEntry[] {
  try {
    const raw = fs.readFileSync(HISTORY_PATH, 'utf-8')
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  fs.mkdirSync(HISTORY_DIR, { recursive: true })
  const history = getHistory()
  const newEntry: HistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  }
  history.push(newEntry)
  const trimmed = history.slice(-MAX_ENTRIES)
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(trimmed, null, 2))
}

export function clearHistory(): void {
  fs.writeFileSync(HISTORY_PATH, '[]')
}
