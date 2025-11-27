'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  GitCompare,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalChats: number;
  totalComparisons: number;
  recentChats: Array<{ id: string; title: string; updated_at: string }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalChats: 0,
    totalComparisons: 0,
    recentChats: []
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');

    // Fetch chat sessions
    const { data: chats, count: chatCount } = await supabase
      .from('chat_sessions')
      .select('id, title, updated_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(3);

    // Fetch comparisons count
    const { count: comparisonCount } = await supabase
      .from('saved_comparisons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setStats({
      totalChats: chatCount || 0,
      totalComparisons: comparisonCount || 0,
      recentChats: chats || []
    });

    setLoading(false);
  };

  const createNewChat = async () => {
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: 'New Conversation', messages: [] })
      .select()
      .single();

    if (data) router.push(`/dashboard/chats/${data.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>Welcome back, {userName}!</span>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-muted-foreground mt-2">
          Ready to explore your study abroad options? Let&apos;s find your perfect university.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start New Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized university recommendations
              </p>
              <Button onClick={createNewChat} disabled={creating} className="w-full">
                {creating ? 'Creating...' : 'New Conversation'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                <GitCompare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Comparisons</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {stats.totalComparisons} saved comparison{stats.totalComparisons !== 1 ? 's' : ''}
              </p>
              <Link href="/dashboard/comparisons" className="w-full">
                <Button variant="outline" className="w-full">
                  View Comparisons
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-500/10 rounded-full mb-4">
                <User className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your preferences
              </p>
              <Link href="/dashboard/profile" className="w-full">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{stats.totalChats}</div>
            <p className="text-sm text-muted-foreground">
              chat session{stats.totalChats !== 1 ? 's' : ''} with AI advisor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              Saved Comparisons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">{stats.totalComparisons}</div>
            <p className="text-sm text-muted-foreground">
              university comparison{stats.totalComparisons !== 1 ? 's' : ''} saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Chats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Conversations
            </CardTitle>
            <Link href="/dashboard/chats">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentChats.length > 0 ? (
            <div className="space-y-3">
              {stats.recentChats.map((chat) => (
                <Link key={chat.id} href={`/dashboard/chats/${chat.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{chat.title || 'Untitled Conversation'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(chat.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No conversations yet</p>
              <Button onClick={createNewChat} disabled={creating}>
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
