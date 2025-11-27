'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    setSessions(data || []);
    setLoading(false);
  };

  const createNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: 'New Conversation', messages: [] })
      .select()
      .single();

    if (data) router.push(`/dashboard/chats/${data.id}`);
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm('Are you sure you want to delete this conversation?');
    if (!confirmed) return;

    await supabase.from('chat_sessions').delete().eq('id', id);
    setSessions(sessions.filter(s => s.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Conversations</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your chat sessions with the AI advisor
          </p>
        </div>
        <Button size="lg" onClick={createNewChat}>
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      {sessions.length > 0 ? (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Link key={session.id} href={`/dashboard/chats/${session.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {session.title || 'Untitled Conversation'}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(e) => deleteSession(session.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(session.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start your first conversation with our AI advisor to get personalized university
              recommendations and guidance.
            </p>
            <Button size="lg" onClick={createNewChat}>
              <Plus className="h-5 w-5 mr-2" />
              Start Your First Chat
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
