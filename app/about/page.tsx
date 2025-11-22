import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <svg className="text-primary" fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>StudyAbroadAI</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
              <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
              <Link href="/about" className="text-sm font-medium text-primary">About Us</Link>
            </nav>
            <div className="flex gap-2">
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="text-white text-5xl md:text-6xl font-black leading-tight">About StudyAbroadAI</h1>
            <p className="mt-4 text-xl md:text-2xl font-normal text-blue-100">
              Empowering Indian students to pursue global education
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <div className="mt-6 space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-400">
              <p>
                StudyAbroadAI was founded on a simple yet powerful idea: to make global education accessible to every ambitious student in India. We recognized the immense challenges students face—navigating a sea of information, understanding complex application processes, and finding unbiased guidance. Our platform was created to solve this very problem.
              </p>
              <p>
                Our vision is to become the most trusted companion for Indian students on their journey to studying abroad. By leveraging cutting-edge AI, we provide personalized, accurate, and comprehensive support, ensuring that every student can find their perfect university and unlock their full potential on the world stage.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Why We Built This</h2>
            <div className="mt-6 space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-400">
              <p>
                We've been there. As former students, we remember the late nights, the confusing university websites, and the anxiety of not knowing if we were making the right choices. The dream of studying abroad felt like a complex puzzle with missing pieces.
              </p>
              <p>
                That's why we created StudyAbroadAI. We wanted to build the tool we wish we had—a smart, intuitive platform that cuts through the noise and offers clear, data-driven guidance. We're a team of educators, engineers, and former international students passionate about using technology to break down barriers and connect talent with opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "🎯", title: "Accuracy", description: "We are committed to providing reliable, up-to-date information to guide your most important decisions." },
                { icon: "🌍", title: "Accessibility", description: "Making expert guidance available to all students, regardless of their background or location." },
                { icon: "👥", title: "Inclusivity", description: "Supporting students from diverse backgrounds and helping them find a place where they belong." },
                { icon: "💡", title: "Innovation", description: "Using AI to constantly simplify and enhance the university search and application process." }
              ].map((value, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Let's Start Your Journey</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <a href="mailto:hello@studyabroadai.com" className="mt-6 inline-block text-primary text-lg font-medium hover:underline">
              hello@studyabroadai.com
            </a>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="px-8 py-6 text-lg">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-primary">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
                </svg>
              </div>
              <h2 className="text-base font-bold text-white">StudyAbroadAI</h2>
            </div>
            <p className="text-sm">© 2024 StudyAbroadAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm hover:text-white">Privacy Policy</Link>
              <Link href="#" className="text-sm hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
