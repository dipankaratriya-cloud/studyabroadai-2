import { createClient } from '@/lib/supabase/server';
import { streamChatCompletion, generateChatTitle } from '@/lib/groq/client';
import { ADVISOR_SYSTEM_PROMPT } from '@/lib/groq/prompts';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { message, sessionId } = await req.json();

    const { data: session } = await supabase.from('chat_sessions').select('*').eq('id', sessionId).eq('user_id', user.id).single();
    if (!session) return new Response('Session not found', { status: 404 });

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    const allMessages = [...(session.messages || []), userMessage];
    const groqMessages = allMessages.map(({ role, content }) => ({ role, content }));

    const stream = await streamChatCompletion(groqMessages, ADVISOR_SYSTEM_PROMPT);
    let fullResponse = '';

    // Check if we should generate a title (when title is default or empty)
    const currentTitle = session.title?.trim() || '';
    const shouldGenerateTitle = (!currentTitle || currentTitle === 'New Conversation') && allMessages.filter((m: { role: string }) => m.role === 'user').length >= 1;

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          const updatedMessages = [...allMessages, { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() }];

          // Generate and update title if needed
          if (shouldGenerateTitle) {
            const newTitle = await generateChatTitle(updatedMessages);
            await supabase.from('chat_sessions').update({
              messages: updatedMessages,
              title: newTitle,
              updated_at: new Date().toISOString()
            }).eq('id', sessionId);
          } else {
            await supabase.from('chat_sessions').update({
              messages: updatedMessages,
              updated_at: new Date().toISOString()
            }).eq('id', sessionId);
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  } catch (error) {
    return new Response('Internal error', { status: 500 });
  }
}
