import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 10c-2.4 2.4-5.4 4-8.5 4-3.1 0-6.1-1.6-8.5-4"></path>
              <path d="M5.5 10a13.7 13.7 0 0 1 13 0"></path>
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"></path>
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            </svg>
            <span>StudyAbroadAI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-white font-semibold text-lg hover:text-blue-200">Features</Link>
            <Link href="/about" className="text-white font-semibold text-lg hover:text-blue-200">About</Link>
            <Link href="/login" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2 rounded-full font-semibold hover:bg-white/20 transition-all">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-blue-900 to-purple-700 overflow-hidden">
        <div className="container mx-auto px-6 py-24 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Your Journey to Study Abroad Starts Here
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-xl mx-auto md:mx-0">
              AI-powered guidance for Indian students pursuing global education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  Start Free Chat
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/10 text-white border-white hover:bg-white/20">
                  Learn How
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-12">
            Simple Steps to Your Dream University
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎯",
                title: "1. Profile Matching",
                description: "Our AI analyzes your profile to suggest the best-fit universities and courses."
              },
              {
                icon: "📝",
                title: "2. Application Help",
                description: "Get step-by-step guidance on your applications, SOPs, and LORs."
              },
              {
                icon: "💰",
                title: "3. Visa & Finance",
                description: "We assist you with visa documentation and financial planning."
              },
              {
                icon: "✈️",
                title: "4. Pre-Departure",
                description: "Connect with fellow students and get ready for your new life abroad."
              }
            ].map((step, index) => (
              <div key={index} className="group text-center p-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 dark:border-gray-800">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-gray-800" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Discover Our Key Features
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
              Everything you need for a successful application.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Course Finder",
                description: "Personalized university and course recommendations based on your academic profile and interests.",
                icon: "🎓"
              },
              {
                title: "Real-time Tracking",
                description: "Monitor your application status for multiple universities in one simple dashboard.",
                icon: "📊"
              },
              {
                title: "Expert Mentorship",
                description: "Connect with alumni from top universities for guidance and insider tips.",
                icon: "👥"
              },
              {
                title: "SOP/LOR Analyzer",
                description: "Improve your essays and recommendation letters with our AI-powered review tool.",
                icon: "📄"
              },
              {
                title: "Scholarship Alerts",
                description: "Never miss a deadline with automated alerts for scholarships you're eligible for.",
                icon: "💡"
              },
              {
                title: "Community Access",
                description: "Join a network of aspiring students to share experiences and support each other.",
                icon: "🤝"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-gray-400 font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2">100+</p>
              <p className="text-lg text-slate-200">Universities Partnered</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2">20+</p>
              <p className="text-lg text-slate-200">Countries Covered</p>
            </div>
            <div className="pt-8 md:pt-0">
              <p className="text-6xl lg:text-7xl font-bold mb-2">Real-time</p>
              <p className="text-lg text-slate-200">Data & Insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-primary to-purple-600">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who trusted StudyAbroadAI to find their dream university. Get started today for free.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary font-bold py-6 px-10 text-lg hover:bg-slate-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28">
                  <path d="M21.5 10c-2.4 2.4-5.4 4-8.5 4-3.1 0-6.1-1.6-8.5-4"></path>
                  <path d="M5.5 10a13.7 13.7 0 0 1 13 0"></path>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"></path>
                </svg>
                <span>StudyAbroadAI</span>
              </Link>
              <p className="max-w-xs">AI-powered guidance for Indian students pursuing global education.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 StudyAbroadAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
