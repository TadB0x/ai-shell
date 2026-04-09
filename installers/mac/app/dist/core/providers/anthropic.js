import Anthropic from '@anthropic-ai/sdk';
import { PROVIDER_MODELS } from '../../types.js';
const MODEL = PROVIDER_MODELS.anthropic;
const COMMAND_PROMPT = `You are a shell command expert. Convert the user's plain English request into a single shell command.
Respond with JSON only — no markdown, no code fences.
Format: {"command": "<the exact shell command>", "explanation": "<1-2 sentence plain English explanation>"}
Prefer POSIX-compatible commands that work on Linux/macOS.`;
const EXPLAIN_PROMPT = `You are a shell command explainer. Given a shell command, explain what it does in 2-3 plain English sentences. Use simple language, no jargon.`;
export async function generateCommand(query, apiKey) {
    const client = new Anthropic({ apiKey });
    try {
        const res = await client.messages.create({
            model: MODEL,
            max_tokens: 512,
            system: COMMAND_PROMPT,
            messages: [{ role: 'user', content: query }],
        });
        const text = res.content[0].type === 'text' ? res.content[0].text : '';
        const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        const parsed = JSON.parse(clean);
        return { ...parsed, provider: 'anthropic', model: MODEL };
    }
    catch (err) {
        if (err instanceof Anthropic.AuthenticationError)
            throw new Error('Invalid Anthropic API key. Run `ai config` to update it.');
        if (err instanceof Anthropic.RateLimitError)
            throw new Error('Anthropic rate limit reached. Try again in a moment.');
        if (err instanceof SyntaxError)
            throw new Error('Could not parse AI response. Please try again.');
        throw err;
    }
}
export async function explainCommand(command, apiKey) {
    const client = new Anthropic({ apiKey });
    try {
        const res = await client.messages.create({
            model: MODEL,
            max_tokens: 512,
            system: EXPLAIN_PROMPT,
            messages: [{ role: 'user', content: command }],
        });
        return res.content[0].type === 'text' ? res.content[0].text : '';
    }
    catch (err) {
        if (err instanceof Anthropic.AuthenticationError)
            throw new Error('Invalid Anthropic API key. Run `ai config` to update it.');
        throw err;
    }
}
