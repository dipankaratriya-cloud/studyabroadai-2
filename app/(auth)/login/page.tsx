'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex flex-col items-center justify-center mb-6">
        <svg className="text-primary h-12 w-12" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="48">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>

      <div className="w-full rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-background-dark md:p-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[#0e121b] dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3">
            Welcome Back
          </h1>
          <p className="text-[#4d6599] dark:text-slate-400 text-sm font-normal leading-normal pb-6">
            Sign in to continue your journey
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-[#0e121b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#0e121b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="h-12 w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <hr className="w-full border-slate-200 dark:border-slate-800" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">OR</span>
          <hr className="w-full border-slate-200 dark:border-slate-800" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="h-12 w-full gap-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </Button>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
