import Anthropic from '@anthropic-ai/sdk';
const MODEL = 'claude-haiku-4-5';
const COMMAND_SYSTEM_PROMPT = `You are a shell command expert. Convert the user's plain English request into a single shell command.
Respond with JSON only — no markdown, no code fences, no explanation outside the JSON.
Format: {"command": "<the exact shell command>", "explanation": "<1-2 sentence plain English explanation of what the command does and any important flags>"}
The command must work on Linux/macOS. Prefer POSIX-compatible commands.`;
const EXPLAIN_SYSTEM_PROMPT = `You are a shell command explainer for people new to the terminal.
Given a shell command, explain what it does in 2-3 plain English sentences.
Cover what each part does, using simple language — no jargon. Be concise and friendly.`;
function makeClient(apiKey) {
    return new Anthropic({ apiKey });
}
export async function generateCommand(query, apiKey) {
    const client = makeClient(apiKey);
    try {
        const response = await client.messages.create({
            model: MODEL,
            max_tokens: 512,
            system: COMMAND_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: query }],
        });
        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        // Strip any accidental markdown fences
        const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        const parsed = JSON.parse(clean);
        if (!parsed.command || !parsed.explanation) {
            throw new Error('Invalid response format from AI');
        }
        return parsed;
    }
    catch (err) {
        if (err instanceof Anthropic.AuthenticationError) {
            throw new Error('Invalid API key. Run `ai config` to update it.');
        }
        if (err instanceof Anthropic.RateLimitError) {
            throw new Error('Rate limited. Please wait a moment and try again.');
        }
        if (err instanceof SyntaxError) {
            throw new Error('Could not parse AI response. Please try again.');
        }
        throw err;
    }
}
export async function explainCommand(command, apiKey) {
    const client = makeClient(apiKey);
    try {
        const response = await client.messages.create({
            model: MODEL,
            max_tokens: 512,
            system: EXPLAIN_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: command }],
        });
        return response.content[0].type === 'text' ? response.content[0].text : '';
    }
    catch (err) {
        if (err instanceof Anthropic.AuthenticationError) {
            throw new Error('Invalid API key. Run `ai config` to update it.');
        }
        if (err instanceof Anthropic.RateLimitError) {
            throw new Error('Rate limited. Please wait a moment and try again.');
        }
        throw err;
    }
}
