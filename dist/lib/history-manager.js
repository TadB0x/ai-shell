import fs from 'fs';
import os from 'os';
import path from 'path';
const HISTORY_DIR = path.join(os.homedir(), '.ai-shell');
const HISTORY_PATH = path.join(HISTORY_DIR, 'history.json');
const MAX_ENTRIES = 500;
export function getHistory() {
    try {
        const raw = fs.readFileSync(HISTORY_PATH, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
export function addHistoryEntry(entry) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
    const history = getHistory();
    const newEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...entry,
    };
    history.push(newEntry);
    const trimmed = history.slice(-MAX_ENTRIES);
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(trimmed, null, 2));
}
export function clearHistory() {
    fs.writeFileSync(HISTORY_PATH, '[]');
}
