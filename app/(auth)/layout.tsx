'use client';

import Link from 'next/link';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-primary overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#0984e3]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">StudyAbroadAI</span>
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Your Journey to Global Education Starts Here
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Get personalized university recommendations powered by AI. Find your perfect fit from thousands of programs worldwide.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">AI-Powered Matching</p>
                  <p className="text-sm text-white/70">Get recommendations tailored to your profile</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">100+ Universities</p>
                  <p className="text-sm text-white/70">Explore top institutions worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Scholarship Guidance</p>
                  <p className="text-sm text-white/70">Find funding opportunities that fit you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-white/60">
            Trusted by 50,000+ students worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}
