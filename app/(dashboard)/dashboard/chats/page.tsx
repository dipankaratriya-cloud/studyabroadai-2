import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ChatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's chat sessions
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user?.id || '')
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">My Conversations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all your chat sessions with the AI advisor
          </p>
        </div>
        <Link href="/dashboard/chats/new">
          <Button size="lg">
            <span className="text-xl mr-2">✨</span>
            New Chat
          </Button>
        </Link>
      </div>

      {/* Chat List */}
      {sessions && sessions.length > 0 ? (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {session.title || 'Untitled Conversation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(session.updated_at).toLocaleDateString()}
                  </p>
                  <Link href={`/dashboard/chats/${session.id}`}>
                    <Button variant="outline">Continue Chat</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Start your first conversation with our AI advisor to get personalized university
              recommendations and guidance.
            </p>
            <Link href="/dashboard/chats/new">
              <Button size="lg">Start Your First Chat</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
