import chalk from 'chalk'
import { clearHistory, getHistory } from '../lib/history-manager.js'
import { renderHistoryEntry } from '../ui/output.js'

export function showHistory(count: number): void {
  const history = getHistory()
  if (history.length === 0) {
    console.log(chalk.dim('  No history yet. Run `ai "your query"` to get started.'))
    return
  }
  const entries = history.slice(-count).reverse()
  console.log()
  console.log(chalk.bold(`  Last ${entries.length} commands:\n`))
  entries.forEach((entry, i) => {
    renderHistoryEntry(i, entry.timestamp, entry.query, entry.command)
  })
}

export function runClearHistory(): void {
  clearHistory()
  console.log(chalk.green('  ✓ History cleared.'))
}
