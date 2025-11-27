'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-background-dark p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2 pb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">🎓</div>
          <span className="text-xl font-bold">StudyAbroadAI</span>
        </div>
        <h1 className="text-zinc-900 dark:text-zinc-100 text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm text-center pt-2 pb-6">Enter your email and we&apos;ll send you a reset link</p>
        {success ? (
          <div className="w-full p-4 bg-green-50 text-green-600 rounded-lg text-center">
            Check your email for the reset link!
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex w-full flex-col items-center gap-4">
            {error && <div className="w-full p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <div className="flex w-full flex-col">
              <label className="flex flex-col w-full">
                <p className="text-zinc-900 dark:text-zinc-100 text-sm font-medium pb-2">Email Address</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="flex w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-11 px-3 text-sm" placeholder="e.g., yourname@email.com" type="email" required />
              </label>
            </div>
            <div className="flex w-full pt-2">
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </div>
          </form>
        )}
        <Link href="/login" className="mt-6 text-sm font-medium text-primary hover:underline">Back to Login</Link>
      </div>
    </div>
  );
}
