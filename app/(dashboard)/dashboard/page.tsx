'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import {
  MessageSquare,
  GitCompare,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Clock,
  TrendingUp,
  Target,
  Loader2,
  ChevronRight,
  Zap
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

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GSAP animations after loading
  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero section animation
    tl.fromTo('.dashboard-badge',
      { y: 20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6 }
    )
    .fromTo('.dashboard-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.3'
    )
    .fromTo('.dashboard-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.4'
    )
    .fromTo('.dashboard-cta',
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5 },
      '-=0.3'
    );

    // Stats cards stagger animation
    gsap.fromTo('.stat-card-animate',
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        delay: 0.3
      }
    );

    // Quick actions cards
    gsap.fromTo('.quick-action-card',
      { y: 30, opacity: 0, x: -20 },
      {
        y: 0,
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.5
      }
    );

    // Recent conversations section
    gsap.fromTo('.recent-section',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.7
      }
    );

    // Chat items stagger
    gsap.fromTo('.chat-item',
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.9
      }
    );

    // Tips section
    gsap.fromTo('.tip-card',
      { y: 30, opacity: 0, rotateY: 10 },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1.1
      }
    );

  }, { scope: containerRef, dependencies: [loading] });

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');

    const { data: chats, count: chatCount } = await supabase
      .from('chat_sessions')
      .select('id, title, updated_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="dashboard-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-0">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Welcome back
                </div>
                <h1 className="dashboard-title text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 opacity-0">
                  Hello, {userName}!
                </h1>
                <p className="dashboard-subtitle text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl opacity-0">
                  Continue exploring universities or start a new conversation with your AI advisor.
                </p>
              </div>
              <Button
                onClick={createNewChat}
                disabled={creating}
                size="lg"
                className="dashboard-cta btn-primary h-10 sm:h-12 px-4 sm:px-6 hidden sm:flex opacity-0"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                )}
                New Conversation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Conversations Card */}
            <div className="stat-card-animate stat-card group cursor-pointer hover:border-primary/20 transition-all duration-300 opacity-0">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="icon-box w-10 h-10 sm:w-14 sm:h-14 gradient-primary-subtle rounded-lg sm:rounded-xl">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">{stats.totalChats}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Conversations</p>
            </div>

            {/* Comparisons Card */}
            <div className="stat-card-animate stat-card group cursor-pointer hover:border-primary/20 transition-all duration-300 opacity-0">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="icon-box w-10 h-10 sm:w-14 sm:h-14 bg-primary/10 rounded-lg sm:rounded-xl">
                  <GitCompare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">{stats.totalComparisons}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Saved Comparisons</p>
            </div>

            {/* Quick Start Card */}
            <div
              onClick={createNewChat}
              className="stat-card-animate stat-card group cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all duration-300 gradient-primary-subtle opacity-0 col-span-2 sm:col-span-1"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="icon-box w-10 h-10 sm:w-14 sm:h-14 gradient-primary rounded-lg sm:rounded-xl">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-lg sm:text-xl font-bold mb-1">Quick Start</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Start a new AI conversation</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <Link href="/dashboard/comparisons" className="block">
              <div className="quick-action-card card-elevated p-4 sm:p-6 group hover:border-primary/20 transition-all duration-300 opacity-0">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="icon-box w-10 h-10 sm:w-14 sm:h-14 bg-primary/10 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                    <GitCompare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">View Comparisons</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {stats.totalComparisons} saved comparison{stats.totalComparisons !== 1 ? 's' : ''} to review
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </div>
            </Link>

            <Link href="/dashboard/profile" className="block">
              <div className="quick-action-card card-elevated p-4 sm:p-6 group hover:border-emerald-500/20 transition-all duration-300 opacity-0">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="icon-box w-10 h-10 sm:w-14 sm:h-14 bg-emerald-500/10 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Your Profile</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      Manage your preferences and settings
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Conversations */}
          <div className="recent-section card-elevated overflow-hidden opacity-0">
            <div className="p-4 sm:p-6 border-b flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="icon-box w-9 h-9 sm:w-11 sm:h-11 gradient-primary-subtle rounded-lg sm:rounded-xl">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-semibold">Recent Conversations</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Continue where you left off</p>
                </div>
              </div>
              <Link href="/dashboard/chats">
                <Button variant="ghost" className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </div>

            <div className="divide-y">
              {stats.recentChats.length > 0 ? (
                stats.recentChats.map((chat, index) => (
                  <Link key={chat.id} href={`/dashboard/chats/${chat.id}`}>
                    <div className="chat-item p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-accent/50 transition-colors group opacity-0">
                      <div className="icon-box w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 group-hover:bg-primary/15 transition-colors rounded-lg sm:rounded-xl">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors">
                          {chat.title || 'Untitled Conversation'}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(chat.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 sm:p-12 text-center">
                  <div className="icon-box w-12 h-12 sm:w-16 sm:h-16 gradient-primary-subtle mx-auto mb-3 sm:mb-4 rounded-xl">
                    <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-6 max-w-sm mx-auto">
                    Start your first conversation with Aanya, your AI study abroad advisor.
                  </p>
                  <Button onClick={createNewChat} disabled={creating} className="btn-primary text-sm sm:text-base">
                    {creating ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    )}
                    Start First Conversation
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="tip-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent opacity-0">
              <div className="icon-box w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 mb-3 sm:mb-4 rounded-lg sm:rounded-xl">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Get Recommendations</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tell Aanya about your goals and get personalized university suggestions.
              </p>
            </div>

            <div className="tip-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent opacity-0">
              <div className="icon-box w-9 h-9 sm:w-11 sm:h-11 bg-primary/10 mb-3 sm:mb-4 rounded-lg sm:rounded-xl">
                <GitCompare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Compare Universities</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select up to 3 universities to compare side by side.
              </p>
            </div>

            <div className="tip-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0">
              <div className="icon-box w-9 h-9 sm:w-11 sm:h-11 bg-emerald-500/10 mb-3 sm:mb-4 rounded-lg sm:rounded-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Track Progress</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Save your favorite universities and track your application journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
