import type { DangerResult } from '../types.js';
export declare function renderOutput(command: string, explanation: string, danger: DangerResult): void;
export declare function renderExplanation(command: string, explanation: string): void;
export declare function renderHistoryEntry(index: number, timestamp: string, query: string, command: string): void;
