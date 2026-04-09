import type { DangerResult } from '../types.js'

const DANGER_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-rf|-fr|--recursive\s+--force|--force\s+--recursive)/i, label: 'Recursive force delete (rm -rf)' },
  { pattern: /rm\s+-[a-zA-Z]*f/i,                                          label: 'Force delete (rm -f)' },
  { pattern: />\s*\/dev\/[sh]/i,                                            label: 'Writing to device file' },
  { pattern: /mkfs/i,                                                        label: 'Disk format operation (mkfs)' },
  { pattern: /format\s+[a-z]:/i,                                            label: 'Disk format operation' },
  { pattern: /dd\s+.*of=\/dev\//i,                                          label: 'Writing directly to disk (dd)' },
  { pattern: /:\(\)\s*\{\s*:|:\s*&\s*\}/,                                   label: 'Fork bomb detected' },
  { pattern: /chmod\s+(-R\s+)?777/i,                                         label: 'Setting world-writable permissions (777)' },
  { pattern: /chown\s+-R/i,                                                   label: 'Recursive ownership change' },
  { pattern: /sudo\s+rm/i,                                                    label: 'Root-level delete' },
  { pattern: /sudo\s+chmod|sudo\s+chown/i,                                    label: 'Root permission change' },
  { pattern: /sudo\s+dd/i,                                                    label: 'Root disk write' },
  { pattern: /\b(shutdown|reboot|halt|poweroff)\b/i,                         label: 'System shutdown/reboot' },
  { pattern: /curl\s+.*\|\s*(?:sudo\s+)?(?:sh|bash)/i,                       label: 'Piped remote execution (curl | sh)' },
  { pattern: /wget\s+.*\|\s*(?:sudo\s+)?(?:sh|bash)/i,                       label: 'Piped remote execution (wget | sh)' },
  { pattern: /rm\s+.*\/\*\s*$/,                                               label: 'Glob delete (rm .../*)"' },
  { pattern: /\b(truncate|shred)\b/i,                                         label: 'File destruction tool' },
  { pattern: /mv\s+.*\/dev\/null/i,                                           label: 'Moving files to /dev/null (permanent loss)' },
]

export function isDangerous(command: string): DangerResult {
  const reasons: string[] = []
  for (const { pattern, label } of DANGER_PATTERNS) {
    if (pattern.test(command)) {
      reasons.push(label)
    }
  }
  return { isDangerous: reasons.length > 0, reasons }
}
