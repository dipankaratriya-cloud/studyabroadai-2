import { createClient } from '@/lib/supabase/server';
import { streamChatCompletion, generateChatTitle, extractStudentProfile } from '@/lib/groq/client';
import { ADVISOR_SYSTEM_PROMPT } from '@/lib/groq/prompts';

// Increase timeout for Vercel (Pro plan: up to 60s, Hobby: 10s)
export const maxDuration = 60;

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  // Helper to send error response as stream
  const sendErrorStream = (message: string) => {
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
    return new Response(errorStream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return sendErrorStream('Please log in to continue');
    }

    const body = await req.json();
    const { message, sessionId } = body;

    if (!message || !sessionId) {
      return sendErrorStream('Missing message or session');
    }

    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return sendErrorStream('Session not found. Please start a new conversation.');
    }

    const userMessage = { role: 'user' as const, content: message, timestamp: new Date().toISOString() };
    const allMessages = [...(session.messages || []), userMessage];

    // Limit messages to prevent "Request Entity Too Large" error
    // Keep last 6 messages for context (about 3 conversation turns)
    const recentMessages = allMessages.slice(-6);
    const groqMessages = recentMessages.map(({ role, content }: { role: string; content: string }) => ({
      role: role as 'user' | 'assistant',
      content: content.slice(0, 2000) // Limit individual message length
    }));

    // Try to create the stream - this is where Groq API can fail
    let stream;
    try {
      stream = await streamChatCompletion(groqMessages, ADVISOR_SYSTEM_PROMPT);
    } catch (groqError) {
      console.error('Groq API error:', groqError);
      return sendErrorStream('AI service is temporarily unavailable. Please try again in a moment.');
    }

    let fullResponse = '';

    const currentTitle = session.title?.trim() || '';
    const shouldGenerateTitle = (!currentTitle || currentTitle === 'New Conversation') &&
      allMessages.filter((m: { role: string }) => m.role === 'user').length >= 1;

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let hasContent = false;

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              hasContent = true;
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // If no content was received, send a fallback message
          if (!hasContent || !fullResponse.trim()) {
            const fallbackMessage = "I apologize, but I couldn't generate a response. Please try asking your question again.";
            fullResponse = fallbackMessage;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fallbackMessage })}\n\n`));
          }

          const updatedMessages = [...allMessages, { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() }];

          // Extract student profile (don't let this block the response)
          let mergedProfile = session.student_profile || {};
          try {
            const extractedProfile = await extractStudentProfile(updatedMessages);
            if (extractedProfile) {
              mergedProfile = {
                ...mergedProfile,
                ...extractedProfile,
                test_scores: {
                  ...(mergedProfile.test_scores || {}),
                  ...(extractedProfile.test_scores || {})
                },
                goals: {
                  ...(mergedProfile.goals || {}),
                  ...(extractedProfile.goals || {})
                },
                preferred_countries: extractedProfile.preferred_countries
                  ? [...new Set([...(mergedProfile.preferred_countries || []), ...extractedProfile.preferred_countries])]
                  : mergedProfile.preferred_countries
              };
            }
          } catch (profileError) {
            console.error('Profile extraction error (non-blocking):', profileError);
          }

          // Update database
          try {
            if (shouldGenerateTitle) {
              const newTitle = await generateChatTitle(updatedMessages);
              await supabase.from('chat_sessions').update({
                messages: updatedMessages,
                title: newTitle,
                student_profile: mergedProfile,
                updated_at: new Date().toISOString()
              }).eq('id', sessionId);
            } else {
              await supabase.from('chat_sessions').update({
                messages: updatedMessages,
                student_profile: mergedProfile,
                updated_at: new Date().toISOString()
              }).eq('id', sessionId);
            }
          } catch (dbError) {
            console.error('Database update error (non-blocking):', dbError);
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (streamError) {
          console.error('Stream processing error:', streamError);
          // Send error message to client
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'An error occurred while generating the response.' })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  } catch (error) {
    console.error('Chat stream error:', error);
    return sendErrorStream('Something went wrong. Please try again.');
  }
}
