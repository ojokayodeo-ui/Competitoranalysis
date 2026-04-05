/**
 * Anthropic SDK wrapper with structured JSON output helpers.
 */
import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.AI_MODEL || 'claude-sonnet-4-6'

let _client: Anthropic | null = null

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

/**
 * Run a prompt and return parsed JSON.
 * Throws if the response is not valid JSON.
 */
export async function runJsonPrompt<T>(
  prompt: string,
  systemHint = 'You are a market intelligence analyst. Return ONLY valid JSON, no markdown fences, no explanation.'
): Promise<T> {
  const client = getClient()

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: systemHint,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim()

  // Strip accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    // Attempt to extract JSON from a larger response
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/m)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as T
    }
    throw new Error(`AI returned non-JSON response: ${cleaned.slice(0, 200)}`)
  }
}
