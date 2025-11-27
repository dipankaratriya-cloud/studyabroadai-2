'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#10204d]/90 backdrop-blur-lg shadow-xl' : ''
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28">
              <path d="M21.5 10c-2.4 2.4-5.4 4-8.5 4-3.1 0-6.1-1.6-8.5-4"></path>
              <path d="M5.5 10a13.7 13.7 0 0 1 13 0"></path>
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 Z"></path>
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4 Z"></path>
            </svg>
            <span>StudyAbroadAI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white font-semibold text-lg hover:underline">
              Features
            </a>
            <Link href="/about" className="text-white font-semibold text-lg hover:underline">
              About
            </Link>
            <Link href="/login" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2 rounded-full font-semibold hover:bg-white/20 transition-all">
              Login
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#1a2c6d] to-[#6f228b] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                left: `${Math.random() * 100}%`,
                animation: `float ${25 + Math.random() * 10}s infinite linear`,
                animationDelay: `${-Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-6 py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ textShadow: '0 0 15px rgba(255,255,255,0.4)' }}>
              Your Journey to Study Abroad Starts Here
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-xl mx-auto md:mx-0">
              AI-powered guidance for Indian students pursuing global education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/signup" className="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                Start Free Chat
              </Link>
              <a href="#how-it-works" className="relative border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all transform hover:-translate-y-1 overflow-hidden">
                <span className="relative z-10">Learn How</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-12">
            Simple Steps to Your Dream University
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: '1. Profile Matching', desc: 'Our AI analyzes your profile to suggest the best-fit universities and courses.' },
              { icon: '📝', title: '2. Application Help', desc: 'Get step-by-step guidance on your applications, SOPs, and LORs.' },
              { icon: '💰', title: '3. Visa & Finance', desc: 'We assist you with visa documentation and financial planning.' },
              { icon: '✈️', title: '4. Pre-Departure', desc: 'Connect with fellow students and get ready for your new life abroad.' }
            ].map((step, i) => (
              <div key={i} className="fade-in opacity-0 translate-y-5 transition-all duration-500 text-center p-8 rounded-xl hover:shadow-2xl hover:-translate-y-2 border border-slate-100">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Discover Our Key Features</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need for a successful application.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI Course Finder', desc: 'Personalized university and course recommendations based on your academic profile and interests.', bg: 'bg-blue-100', text: 'text-primary' },
              { title: 'Real-time Tracking', desc: 'Monitor your application status for multiple universities in one simple dashboard.', bg: 'bg-purple-100', text: 'text-[#7c3aed]' },
              { title: 'Expert Mentorship', desc: 'Connect with alumni from top universities for guidance and insider tips.', bg: 'bg-green-100', text: 'text-green-500' },
              { title: 'SOP/LOR Analyzer', desc: 'Improve your essays and recommendation letters with our AI-powered review tool.', bg: 'bg-red-100', text: 'text-red-600' },
              { title: 'Scholarship Alerts', desc: 'Never miss a deadline with automated alerts for scholarships you\'re eligible for.', bg: 'bg-orange-100', text: 'text-orange-500' },
              { title: 'Community Access', desc: 'Join a network of aspiring students to share experiences and support each other.', bg: 'bg-indigo-100', text: 'text-indigo-600' }
            ].map((feature, i) => (
              <div key={i} className="fade-in opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2">
                <div className={`flex items-center justify-center w-16 h-16 ${feature.bg} ${feature.text} rounded-xl mb-5 text-3xl`}>★</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-[#1a2c6d] to-[#6f228b] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2 fade-in opacity-0 translate-y-5">100+</p>
              <p className="text-lg text-slate-200">Universities Partnered</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2 fade-in opacity-0 translate-y-5">20+</p>
              <p className="text-lg text-slate-200">Countries Covered</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2 fade-in opacity-0 translate-y-5">Real-time</p>
              <p className="text-lg text-slate-200">Data & Insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How is StudyAbroadAI different from traditional consultants?', a: 'We use AI to provide personalized, data-driven recommendations, making the process faster, more transparent, and tailored to your unique profile. Our platform is accessible 24/7, unlike traditional agents.' },
              { q: 'Is the initial consultation free?', a: 'Yes, you can start a free chat with our AI assistant to get initial university suggestions and understand how our platform can help you. Advanced features may require a subscription.' },
              { q: 'What countries do you cover?', a: 'We cover over 20 popular study destinations, including the USA, UK, Canada, Australia, Germany, and more. Our database is constantly updated with new universities and countries.' },
              { q: 'Can you help with visa applications?', a: 'Absolutely. We provide comprehensive guidance on visa documentation, interview preparation, and financial planning to ensure a smooth visa process.' },
              { q: 'How accurate is the AI matching?', a: 'Our AI algorithm is powered by real-time data from universities and historical admission trends. While highly accurate, we always recommend you use it as a powerful guide alongside your own research.' }
            ].map((faq, i) => (
              <details key={i} className="group border-b pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <span className="text-2xl text-slate-500 group-open:rotate-45 transform transition-transform duration-300">+</span>
                </summary>
                <p className="mt-4 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-primary to-[#7c3aed]">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who trusted StudyAbroadAI to find their dream university. Get started today for free.
          </p>
          <Link href="/signup" className="inline-block bg-white text-primary font-bold py-4 px-10 text-lg rounded-lg shadow-lg hover:bg-slate-100 transition-all">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28">
                  <path d="M21.5 10c-2.4 2.4-5.4 4-8.5 4-3.1 0-6.1-1.6-8.5-4"></path>
                  <path d="M5.5 10a13.7 13.7 0 0 1 13 0"></path>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 Z"></path>
                  <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4 Z"></path>
                </svg>
                <span>StudyAbroadAI</span>
              </Link>
              <p className="max-w-xs">AI-powered guidance for Indian students pursuing global education.</p>
            </div>
            <div className="grid grid-cols-2 md:col-span-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 StudyAbroadAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0vh) translateX(0vw) scale(1); opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(5vw) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
