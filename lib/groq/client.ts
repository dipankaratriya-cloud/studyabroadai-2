import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function streamChatCompletion(messages: ChatCompletionMessageParam[], systemPrompt: string) {
  return await groq.chat.completions.create({
    model: 'groq/compound-mini',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    temperature: 0.7,
    max_tokens: 2000,
  });
}

export async function generateChatTitle(messages: Array<{ role: string; content: string }>): Promise<string> {
  try {
    // Get the first meaningful user message (skip simple greetings)
    const userMessages = messages.filter(m => m.role === 'user');

    if (userMessages.length === 0) {
      return 'New Conversation';
    }

    // Find first non-greeting message or use the first one
    const greetings = ['hi', 'hello', 'hey', 'hii', 'hiii'];
    let meaningfulMessage = userMessages.find(m =>
      !greetings.includes(m.content.toLowerCase().trim())
    );

    // If all are greetings, use the latest user message
    if (!meaningfulMessage) {
      meaningfulMessage = userMessages[userMessages.length - 1];
    }

    const messageContent = meaningfulMessage.content.trim();

    // If message is very short (likely a greeting), return generic title
    if (messageContent.length < 5) {
      return 'Study Abroad Chat';
    }

    // Try to generate title with Groq
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Generate a very short title (3-6 words) summarizing what the user is asking about. Focus on country, field of study, or topic. Return ONLY the title text, nothing else. No quotes, no explanations.'
        },
        {
          role: 'user',
          content: messageContent.slice(0, 300)
        }
      ],
      temperature: 0.2,
      max_tokens: 15,
    });

    const generatedTitle = response.choices[0]?.message?.content?.trim();

    // Validate the generated title
    if (generatedTitle && generatedTitle.length > 3 && generatedTitle.length < 60) {
      // Remove any quotes if present
      return generatedTitle.replace(/^["']|["']$/g, '');
    }

    // Fallback: Use first 50 chars of user message
    return messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '');
  } catch (error) {
    console.error('Error generating title:', error);
    // Fallback: Use first user message
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      return firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
    }
    return 'Study Abroad Chat';
  }
}

export { groq };
