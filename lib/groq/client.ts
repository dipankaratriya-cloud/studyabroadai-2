import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface ChatCompletionOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export async function createChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: ChatCompletionOptions = {}
) {
  const {
    model = 'llama-3.3-70b-versatile', // Fallback model if Moonshot not available
    temperature = 0.7,
    max_tokens = 2000,
    stream = false,
  } = options

  return await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
    stream,
  })
}

export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 2000,
  })

  return stream
}

export { groq }
