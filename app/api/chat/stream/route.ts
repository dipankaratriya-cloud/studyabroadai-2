import { createClient } from '@/lib/supabase/server'
import { streamChatCompletion } from '@/lib/groq/client'
import { ADVISOR_SYSTEM_PROMPT } from '@/lib/groq/prompts'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('Stream error: Unauthorized - no user')
      return new Response('Unauthorized', { status: 401 })
    }

    const { message, sessionId } = await req.json()
    console.log('Stream request:', { sessionId, messageLength: message?.length })

    // Get existing session
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError) {
      console.error('Session fetch error:', sessionError)
      return new Response('Session not found', { status: 404 })
    }

    if (!session) {
      console.error('Session not found for user')
      return new Response('Session not found', { status: 404 })
    }

    // Prepare messages for storage (with timestamps)
    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }
    const allMessages = [
      ...(session.messages || []),
      userMessage,
    ]

    // Prepare messages for Groq API (without timestamps)
    const groqMessages = allMessages.map(({ role, content }) => ({ role, content }))

    console.log('Calling Groq API with', groqMessages.length, 'messages')
    console.log('Groq messages:', JSON.stringify(groqMessages, null, 2))

    // Stream response from Groq
    let stream
    try {
      stream = await streamChatCompletion(groqMessages, ADVISOR_SYSTEM_PROMPT)
      console.log('Groq stream created successfully')
    } catch (groqError) {
      console.error('Groq API error:', groqError)
      const errorMessage = groqError instanceof Error ? groqError.message : 'Failed to connect to AI service'
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    let fullResponse = ''

    // Create a readable stream for the client
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting stream processing...')
          let chunkCount = 0

          for await (const chunk of stream) {
            chunkCount++
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          console.log(`Stream completed. Received ${chunkCount} chunks. Total response length: ${fullResponse.length}`)

          if (fullResponse.length === 0) {
            console.error('WARNING: Empty response from Groq')
            const errorMessage = 'Sorry, I encountered an issue generating a response. Please try again.'
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: errorMessage })}\n\n`))
            fullResponse = errorMessage
          }

          // Save the complete conversation
          const updatedMessages = [
            ...allMessages,
            {
              role: 'assistant',
              content: fullResponse,
              timestamp: new Date().toISOString(),
            },
          ]

          const { error: updateError } = await supabase
            .from('chat_sessions')
            .update({
              messages: updatedMessages,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sessionId)

          if (updateError) {
            console.error('Error saving messages:', updateError)
          } else {
            console.log('Messages saved successfully')
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error('Error details:', errorMessage)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
