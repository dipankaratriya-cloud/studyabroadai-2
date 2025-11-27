import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
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
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <div className="mt-6 space-y-4 text-base md:text-lg text-muted-foreground">
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
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Why We Built This</h2>
            <div className="mt-6 space-y-4 text-base md:text-lg text-muted-foreground">
              <p>
                We&apos;ve been there. As former students, we remember the late nights, the confusing university websites, and the anxiety of not knowing if we were making the right choices. The dream of studying abroad felt like a complex puzzle with missing pieces.
              </p>
              <p>
                That&apos;s why we created StudyAbroadAI. We wanted to build the tool we wish we had—a smart, intuitive platform that cuts through the noise and offers clear, data-driven guidance. We&apos;re a team of educators, engineers, and former international students passionate about using technology to break down barriers and connect talent with opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "🎯", title: "Accuracy", description: "We are committed to providing reliable, up-to-date information to guide your most important decisions." },
                { icon: "🌍", title: "Accessibility", description: "Making expert guidance available to all students, regardless of their background or location." },
                { icon: "👥", title: "Inclusivity", description: "Supporting students from diverse backgrounds and helping them find a place where they belong." },
                { icon: "💡", title: "Innovation", description: "Using AI to constantly simplify and enhance the university search and application process." }
              ].map((value, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Let&apos;s Start Your Journey</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to explore your study abroad options? Our AI advisor is here to help you every step of the way.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StudyAbroadAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
