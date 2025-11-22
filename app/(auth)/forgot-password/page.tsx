'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-background-dark p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2 pb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xl">🎓</span>
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">StudyAbroadAI</span>
        </div>

        <h1 className="text-zinc-900 dark:text-zinc-100 tracking-tight text-2xl font-bold leading-tight text-center">
          Reset Password
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-normal pt-2 pb-6 text-center">
          Enter your email and we'll send you a reset link
        </p>

        {success ? (
          <div className="w-full p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm text-center">
            Check your email for the password reset link!
          </div>
        ) : (
          <>
            {error && (
              <div className="w-full mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex w-full flex-col items-center gap-4">
              <div className="flex w-full flex-col">
                <label className="flex flex-col w-full">
                  <p className="text-zinc-900 dark:text-zinc-100 text-sm font-medium leading-normal pb-2">
                    Email Address
                  </p>
                  <Input
                    type="email"
                    placeholder="e.g., yourname@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </label>
              </div>

              <div className="flex w-full pt-2">
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </>
        )}

        <Link href="/login" className="mt-6 text-sm font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  )
}
