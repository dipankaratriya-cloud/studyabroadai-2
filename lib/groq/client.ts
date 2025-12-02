import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function streamChatCompletion(messages: ChatCompletionMessageParam[], systemPrompt: string) {
  return await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
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

export async function extractStudentProfile(messages: Array<{ role: string; content: string }>): Promise<Record<string, any> | null> {
  try {
    // Only extract if there are enough messages
    if (messages.length < 2) {
      return null;
    }

    const conversationText = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n')
      .slice(-4000); // Limit context size

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `Extract student profile information from this conversation. Return ONLY a valid JSON object with the following structure (include only fields that were explicitly mentioned by the user):

{
  "education_level": "Class 12" | "Undergrad" | "Masters" | "PhD" | "Working Professional",
  "current_grade": "percentage or GPA mentioned",
  "field_of_interest": "subject/field they want to study",
  "budget_min": number (annual budget minimum in USD),
  "budget_max": number (annual budget maximum in USD),
  "budget_currency": "USD" | "EUR" | "INR",
  "preferred_countries": ["array", "of", "countries"],
  "test_scores": {
    "ielts": number,
    "toefl": number,
    "sat": number,
    "gre": number
  },
  "timeline": "target intake like Fall 2025",
  "goals": {
    "degree_type": "Bachelors" | "Masters" | "PhD",
    "research_focused": boolean,
    "immigration_intent": boolean,
    "scholarship_needed": boolean
  }
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no explanation
- Only include fields that the user has explicitly mentioned
- If a field wasn't mentioned, don't include it
- Return {} if no profile info was shared`
        },
        {
          role: 'user',
          content: conversationText
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return null;

    // Try to parse the JSON
    try {
      // Remove any markdown code blocks if present
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      const profile = JSON.parse(jsonStr);

      // Return null if empty object
      if (Object.keys(profile).length === 0) return null;

      return profile;
    } catch (parseError) {
      console.error('Error parsing profile JSON:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error extracting profile:', error);
    return null;
  }
}

export { groq };
