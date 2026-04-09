import { GoogleGenAI } from '@google/genai'
import type { CommandResult } from '../../types.js'
import { PROVIDER_MODELS } from '../../types.js'

const MODEL = PROVIDER_MODELS.gemini

const COMMAND_PROMPT = `You are a shell command expert. Convert the user's plain English request into a single shell command.
Respond with JSON only — no markdown, no code fences.
Format: {"command": "<the exact shell command>", "explanation": "<1-2 sentence plain English explanation>"}
Prefer POSIX-compatible commands that work on Linux/macOS.`

const EXPLAIN_PROMPT = `You are a shell command explainer. Given a shell command, explain what it does in 2-3 plain English sentences. Use simple language, no jargon.`

export async function generateCommand(query: string, apiKey: string): Promise<CommandResult> {
  const ai = new GoogleGenAI({ apiKey })
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: query,
      config: {
        systemInstruction: COMMAND_PROMPT,
        responseMimeType: 'application/json',
      },
    })
    const text = res.text ?? ''
    const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(clean) as { command: string; explanation: string }
    return { ...parsed, provider: 'gemini', model: MODEL }
  } catch (err) {
    const msg = (err as Error).message ?? ''
    if (msg.includes('API_KEY_INVALID') || msg.includes('401')) throw new Error('Invalid Gemini API key. Run `ai config` to update it.')
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) throw new Error('Gemini rate limit reached. Try again in a moment.')
    if (err instanceof SyntaxError) throw new Error('Could not parse AI response. Please try again.')
    throw err
  }
}

export async function explainCommand(command: string, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey })
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: command,
      config: { systemInstruction: EXPLAIN_PROMPT },
    })
    return res.text ?? ''
  } catch (err) {
    const msg = (err as Error).message ?? ''
    if (msg.includes('API_KEY_INVALID') || msg.includes('401')) throw new Error('Invalid Gemini API key. Run `ai config` to update it.')
    throw err
  }
}
