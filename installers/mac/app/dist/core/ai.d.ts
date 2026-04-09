import type { AiShellConfig, CommandResult, Provider } from '../types.js';
export declare function generateCommand(query: string, config: AiShellConfig, provider: Provider): Promise<CommandResult>;
export declare function explainCommand(command: string, config: AiShellConfig, provider: Provider): Promise<string>;
