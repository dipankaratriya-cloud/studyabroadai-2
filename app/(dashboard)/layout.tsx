'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  MessageSquare,
  GitCompare,
  User,
  LogOut,
  GraduationCap,
  Plus,
  ChevronRight,
  DollarSign,
  Globe,
  Calendar,
  Target,
  FileText,
  Award
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProfileProvider, useProfile } from '@/components/providers/ProfileContext';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/chats', icon: MessageSquare, label: 'My Chats' },
  { href: '/dashboard/comparisons', icon: GitCompare, label: 'Comparisons' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

function ProfileSection() {
  const { profile } = useProfile();
  const pathname = usePathname();

  // Only show profile section when on a chat page
  const isOnChatPage = pathname.includes('/dashboard/chats/') && !pathname.endsWith('/new');

  if (!isOnChatPage) return null;

  const hasProfileData = profile && Object.keys(profile).some(key => (profile as Record<string, unknown>)[key] !== null && (profile as Record<string, unknown>)[key] !== undefined);

  return (
    <div className="border-t">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <User className="h-3.5 w-3.5" />
          Your Profile
        </h3>
      </div>
      <div className="p-3 max-h-64 overflow-y-auto">
        {!hasProfileData ? (
          <p className="text-xs text-muted-foreground">Share your details in the chat to see them here.</p>
        ) : (
          <div className="space-y-2">
            {profile?.education_level && (
              <div className="flex items-center gap-2 text-xs">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{profile.education_level}</span>
              </div>
            )}
            {profile?.field_of_interest && (
              <div className="flex items-center gap-2 text-xs">
                <Target className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{profile.field_of_interest}</span>
              </div>
            )}
            {(profile?.budget_min || profile?.budget_max) && (
              <div className="flex items-center gap-2 text-xs">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {profile.budget_currency || '$'}{profile.budget_min?.toLocaleString() || '?'} - {profile.budget_currency || '$'}{profile.budget_max?.toLocaleString() || '?'}
                </span>
              </div>
            )}
            {profile?.preferred_countries && profile.preferred_countries.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {profile.preferred_countries.slice(0, 3).map((country: string, idx: number) => (
                    <span key={idx} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {country}
                    </span>
                  ))}
                  {profile.preferred_countries.length > 3 && (
                    <span className="text-muted-foreground">+{profile.preferred_countries.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            {profile?.test_scores && Object.values(profile.test_scores).some(v => v) && (
              <div className="flex items-start gap-2 text-xs">
                <Award className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  {profile.test_scores.ielts && <span className="text-[10px]">IELTS: <strong>{profile.test_scores.ielts}</strong></span>}
                  {profile.test_scores.toefl && <span className="text-[10px]">TOEFL: <strong>{profile.test_scores.toefl}</strong></span>}
                  {profile.test_scores.gre && <span className="text-[10px]">GRE: <strong>{profile.test_scores.gre}</strong></span>}
                </div>
              </div>
            )}
            {profile?.timeline && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{profile.timeline}</span>
              </div>
            )}
            {profile?.goals?.degree_type && (
              <div className="flex items-center gap-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{profile.goals.degree_type}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      // Clear client-side session first
      await supabase.auth.signOut();

      // Then call server-side route to clear cookies
      await fetch('/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      // Force full page reload to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">StudyAbroadAI</span>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Link
            href="/dashboard/chats/new"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl gradient-primary text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            New Chat
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section - Shows when on chat page */}
        <ProfileSection />

        {/* User Section */}
        <div className="p-4 border-t space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="px-3">
            <ThemeToggle />
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </ProfileProvider>
  );
}
