import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's chat sessions count
  const { count: chatsCount } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id || '')

  // Fetch user's saved comparisons count
  const { count: comparisonsCount } = await supabase
    .from('saved_comparisons')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id || '')

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <h1 className="text-gray-900 dark:text-white text-4xl font-bold leading-tight tracking-tight mb-2">
        Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Ready to continue your study abroad journey?
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <span className="text-2xl">💬</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chatsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Conversations started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities Explored</CardTitle>
            <span className="text-2xl">🎓</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Universities viewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comparisons Saved</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{comparisonsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Saved for review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CTA Card */}
      <Card className="mb-8 bg-gradient-to-br from-primary to-blue-700 text-white border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Ready to explore universities?</h2>
              <p className="text-blue-100">
                Our AI assistant is here to help you find the perfect match. Get personalized
                recommendations and answers to all your questions instantly.
              </p>
            </div>
            <Link href="/dashboard/chats/new">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                <span className="text-xl mr-2">✨</span>
                Start New Chat
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {chatsCount && chatsCount > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You have {chatsCount} conversation{chatsCount > 1 ? 's' : ''} started.
                </p>
                <Link href="/dashboard/chats">
                  <Button variant="outline" className="w-full">
                    View All Chats
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No conversations yet. Start your first chat!
                </p>
                <Link href="/dashboard/chats/new">
                  <Button>Start Chatting</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-medium">Update Profile</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/dashboard/comparisons" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <span className="text-sm font-medium">View Comparisons</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">ℹ️</span>
                  <span className="text-sm font-medium">About Us</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
