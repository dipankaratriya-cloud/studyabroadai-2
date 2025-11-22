import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed flex h-screen w-64 flex-col justify-between bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
              <svg className="text-white h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-normal">StudyAbroadAI</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary transition-colors hover:bg-primary/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-sm font-semibold">Dashboard</p>
            </Link>
            <Link href="/dashboard/chats" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm font-medium">My Chats</p>
            </Link>
            <Link href="/dashboard/comparisons" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium">Comparisons</p>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm font-medium">Profile</p>
            </Link>
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <h2 className="text-gray-900 dark:text-white text-sm font-semibold leading-normal">
                  {user.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal truncate max-w-[120px]">
                  {user.email}
                </p>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
