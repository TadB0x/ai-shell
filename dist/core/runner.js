import { spawn } from 'child_process';
export function executeCommand(command) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, [], { shell: true, stdio: 'inherit' });
        proc.on('close', (code) => resolve(code ?? 1));
        proc.on('error', reject);
    });
}
