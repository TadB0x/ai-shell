import type { HistoryEntry } from '../types.js';
export declare function getHistory(): HistoryEntry[];
export declare function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void;
export declare function clearHistory(): void;
