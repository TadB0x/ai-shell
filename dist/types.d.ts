export interface AiShellConfig {
    apiKey: string;
    model?: string;
    maxHistory?: number;
}
export interface CommandResult {
    command: string;
    explanation: string;
}
export interface HistoryEntry {
    id: string;
    timestamp: string;
    query: string;
    command: string;
    explanation: string;
    executed: boolean;
    exitCode?: number;
}
export interface DangerResult {
    isDangerous: boolean;
    reasons: string[];
}
