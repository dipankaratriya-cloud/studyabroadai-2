'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to terms');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: formData.email, password: formData.password, options: { data: { full_name: formData.fullName } } });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
    if (error) setError(error.message);
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-6 flex justify-center">
        <svg className="h-10 w-auto text-primary" fill="currentColor" height="40" viewBox="0 0 24 24" width="40">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" opacity="0.4"></path>
          <path d="M2 12l10 5 10-5-10-5-10 5z"></path>
        </svg>
      </div>
      <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-background-dark sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start Your Journey</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create your free account</p>
        </div>
        {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="h-12 w-full rounded-lg border border-gray-300 px-4" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 w-full rounded-lg border border-gray-300 px-4" required />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-12" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">👁️</button>
          </div>
          <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="h-12 w-full rounded-lg border border-gray-300 px-4" required />
          <div className="flex items-start">
            <input type="checkbox" id="terms" checked={formData.agreeToTerms} onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})} className="h-4 w-4 rounded" />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">I agree to the <a href="#" className="text-primary">Terms & Conditions</a></label>
          </div>
          <button type="submit" disabled={loading} className="h-12 w-full rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className="my-6 flex items-center"><hr className="w-full" /><span className="mx-4 text-xs text-gray-500">OR</span><hr className="w-full" /></div>
        <button onClick={handleGoogleSignup} className="h-12 w-full rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-2 hover:bg-gray-50">
          <span>Sign up with Google</span>
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="text-primary font-semibold">Login</Link></p>
    </div>
  );
}
