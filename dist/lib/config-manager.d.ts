import type { AiShellConfig } from '../types.js';
export declare function getConfigPath(): string;
export declare function getConfig(): AiShellConfig | null;
export declare function saveConfig(config: AiShellConfig): void;
export declare function hasApiKey(): boolean;
