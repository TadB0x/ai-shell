import type { AiShellConfig, Provider } from '../types.js';
export declare function getConfigPath(): string;
export declare function getConfig(): AiShellConfig | null;
export declare function saveConfig(config: AiShellConfig): void;
export declare function isAllYes(): boolean;
export declare function setAllYes(value: boolean): void;
export declare function hasAnyKey(): boolean;
export declare function getActiveProvider(override?: string): Provider;
