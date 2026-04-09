import { execSync } from 'child_process';
export async function copyToClipboard(text) {
    const escaped = text.replace(/'/g, "'\\''");
    if (process.platform === 'darwin') {
        execSync(`echo '${escaped}' | pbcopy`);
    }
    else if (process.platform === 'win32') {
        execSync(`echo ${text.replace(/[&|<>^]/g, '^$&')} | clip`, { shell: 'cmd.exe' });
    }
    else {
        // Linux — try wl-copy (Wayland), then xclip, then xsel
        const tools = [
            `echo '${escaped}' | wl-copy`,
            `echo '${escaped}' | xclip -selection clipboard`,
            `echo '${escaped}' | xsel --clipboard --input`,
        ];
        for (const cmd of tools) {
            try {
                execSync(cmd, { stdio: 'pipe' });
                return;
            }
            catch {
                // try next
            }
        }
        throw new Error('No clipboard tool found. Install xclip, xsel, or wl-clipboard.');
    }
}
