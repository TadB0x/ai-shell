import ora from 'ora';
export function createSpinner(text) {
    return ora({ text, color: 'cyan', spinner: 'dots' });
}
export async function withSpinner(text, fn) {
    const spinner = createSpinner(text).start();
    try {
        const result = await fn();
        spinner.stop();
        return result;
    }
    catch (err) {
        spinner.fail();
        throw err;
    }
}
