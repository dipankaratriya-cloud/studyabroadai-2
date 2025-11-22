'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleSignup = async () => {
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
      <div className="mb-6 flex justify-center">
        <svg className="h-10 w-auto text-primary" fill="none" height="40" viewBox="0 0 24 24" width="40">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" fill="currentColor" opacity="0.4"></path>
          <path d="M2 12l10 5 10-5-10-5-10 5z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-background-dark sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-headings dark:text-white">Start Your Journey</h1>
          <p className="mt-2 text-sm text-text-body dark:text-gray-400">Create your free account</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div className="relative">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 pl-11"
              required
            />
          </div>

          <div className="relative">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-11"
              required
            />
          </div>

          <div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-body"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password && password.length < 8 && (
              <p className="mt-1.5 text-xs text-red-600">Password must be at least 8 characters long.</p>
            )}
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 pl-11 pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-body"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-text-body dark:text-gray-400">
              I agree to the{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" className="h-12 w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="w-full border-t border-border-light dark:border-gray-600" />
          <span className="mx-4 text-xs font-medium uppercase text-text-body dark:text-gray-400">OR</span>
          <hr className="w-full border-t border-border-light dark:border-gray-600" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          className="h-12 w-full gap-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-text-body dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
