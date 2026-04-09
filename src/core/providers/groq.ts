import Groq from 'groq-sdk'
import type { CommandResult } from '../../types.js'
import { PROVIDER_MODELS } from '../../types.js'

const MODEL = PROVIDER_MODELS.groq

const COMMAND_PROMPT = `You are a shell command expert. Convert the user's plain English request into a single shell command.
Respond with JSON only — no markdown, no code fences.
Format: {"command": "<the exact shell command>", "explanation": "<1-2 sentence plain English explanation>"}
Prefer POSIX-compatible commands that work on Linux/macOS.`

const EXPLAIN_PROMPT = `You are a shell command explainer. Given a shell command, explain what it does in 2-3 plain English sentences. Use simple language, no jargon.`

export async function generateCommand(query: string, apiKey: string): Promise<CommandResult> {
  const client = new Groq({ apiKey })
  try {
    const res = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 512,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: COMMAND_PROMPT },
        { role: 'user', content: query },
      ],
    })
    const text = res.choices[0]?.message?.content ?? ''
    const parsed = JSON.parse(text) as { command: string; explanation: string }
    return { ...parsed, provider: 'groq', model: MODEL }
  } catch (err) {
    const msg = (err as Error).message ?? ''
    if (msg.includes('401') || msg.includes('invalid_api_key')) throw new Error('Invalid Groq API key. Run `ai config` to update it.')
    if (msg.includes('429') || msg.includes('rate_limit')) throw new Error('Groq rate limit reached. Try again in a moment.')
    if (err instanceof SyntaxError) throw new Error('Could not parse AI response. Please try again.')
    throw err
  }
}

export async function explainCommand(command: string, apiKey: string): Promise<string> {
  const client = new Groq({ apiKey })
  try {
    const res = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 512,
      messages: [
        { role: 'system', content: EXPLAIN_PROMPT },
        { role: 'user', content: command },
      ],
    })
    return res.choices[0]?.message?.content ?? ''
  } catch (err) {
    const msg = (err as Error).message ?? ''
    if (msg.includes('401') || msg.includes('invalid_api_key')) throw new Error('Invalid Groq API key. Run `ai config` to update it.')
    throw err
  }
}
