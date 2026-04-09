export type Provider = 'anthropic' | 'gemini' | 'groq';
export interface AiShellConfig {
    defaultProvider: Provider;
    anthropicKey?: string;
    geminiKey?: string;
    groqKey?: string;
    maxHistory?: number;
    allYes?: boolean;
}
export interface CommandResult {
    command: string;
    explanation: string;
    provider: Provider;
    model: string;
}
export interface HistoryEntry {
    id: string;
    timestamp: string;
    query: string;
    command: string;
    explanation: string;
    provider: Provider;
    model: string;
    executed: boolean;
    exitCode?: number;
}
export interface DangerResult {
    isDangerous: boolean;
    reasons: string[];
}
export declare const PROVIDER_LABELS: Record<Provider, string>;
export declare const PROVIDER_MODELS: Record<Provider, string>;
