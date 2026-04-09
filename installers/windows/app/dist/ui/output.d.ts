import type { DangerResult, Provider } from '../types.js';
export declare function renderOutput(command: string, explanation: string, danger: DangerResult, provider: Provider, model: string): void;
export declare function renderExplanation(command: string, explanation: string): void;
export declare function renderHistoryEntry(index: number, timestamp: string, query: string, command: string, provider?: Provider): void;
