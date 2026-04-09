import type { CommandResult } from '../types.js';
export declare function generateCommand(query: string, apiKey: string): Promise<CommandResult>;
export declare function explainCommand(command: string, apiKey: string): Promise<string>;
