'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Globe,
  Users,
  Award,
  FileText,
  Bell,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Star,
  MapPin,
  BookOpen,
  Briefcase,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Target,
      title: 'AI Course Finder',
      desc: 'Get personalized university recommendations based on your profile, preferences, and career goals.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'SOP & LOR Review',
      desc: 'AI-powered analysis to perfect your statements and recommendation letters.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Scholarship Alerts',
      desc: 'Never miss a scholarship deadline with intelligent notifications.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      desc: 'Connect with alumni and counselors from your dream universities.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Globe,
      title: 'Visa Guidance',
      desc: 'Step-by-step visa documentation and interview preparation support.',
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: BookOpen,
      title: 'Application Tracking',
      desc: 'Monitor all your applications in one unified dashboard.',
      color: 'from-indigo-500 to-violet-500'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Tell Us About You',
      desc: 'Share your academic background, test scores, and career aspirations with our AI advisor.',
      icon: Target
    },
    {
      number: '02',
      title: 'Get Matched',
      desc: 'Receive personalized university recommendations based on your unique profile.',
      icon: Sparkles
    },
    {
      number: '03',
      title: 'Apply with Confidence',
      desc: 'Use our tools to craft compelling applications and track your progress.',
      icon: FileText
    },
    {
      number: '04',
      title: 'Start Your Journey',
      desc: 'Get visa guidance, connect with peers, and prepare for your adventure abroad.',
      icon: GraduationCap
    },
  ];

  const stats = [
    { value: '100+', label: 'Partner Universities', icon: GraduationCap },
    { value: '20+', label: 'Countries Covered', icon: MapPin },
    { value: '50K+', label: 'Students Helped', icon: Users },
    { value: '95%', label: 'Success Rate', icon: Star },
  ];

  const faqs = [
    {
      q: 'How is StudyAbroadAI different from traditional consultants?',
      a: 'We use AI to provide personalized, data-driven recommendations instantly, 24/7. Our platform offers transparency, speed, and guidance tailored specifically to your profile - at a fraction of the cost.'
    },
    {
      q: 'Is the initial consultation free?',
      a: 'Yes! Start a free chat with our AI advisor to get university suggestions and understand how we can help. Advanced features are available with our premium plans.'
    },
    {
      q: 'What countries and universities do you cover?',
      a: 'We cover 20+ popular destinations including USA, UK, Canada, Australia, Germany, France, and more. Our database includes thousands of universities and programs.'
    },
    {
      q: 'Can you help with visa applications?',
      a: 'Absolutely. We provide comprehensive visa guidance including document checklists, interview preparation tips, and financial planning assistance.'
    },
    {
      q: 'How accurate is the AI matching?',
      a: 'Our AI uses real admission data and historical trends to provide highly accurate recommendations. We continuously improve based on actual student outcomes.'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b'
            : 'bg-transparent'
        }`}
      >
        <div className="container-lg py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className={scrolled ? 'text-foreground' : 'text-white'}>StudyAbroadAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`font-medium transition-colors animated-underline ${
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`font-medium transition-colors animated-underline ${
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              }`}
            >
              How It Works
            </a>
            <Link
              href="/about"
              className={`font-medium transition-colors animated-underline ${
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              }`}
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden sm:block font-medium px-4 py-2 rounded-lg transition-colors ${
                scrolled
                  ? 'text-foreground hover:bg-accent'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-primary flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-primary overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container-lg relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Study Abroad Guidance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
              Your Journey to{' '}
              <span className="relative">
                Global Education
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 4 298 10" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>{' '}
              Starts Here
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Get personalized university recommendations, application guidance, and visa support - all powered by AI and designed for Indian students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Start Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all"
              >
                See How It Works
                <ChevronDown className="h-5 w-5" />
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>AI-Powered Recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b">
        <div className="container-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center reveal opacity-0">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary-subtle mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section bg-background">
        <div className="container-lg">
          <div className="text-center mb-16 reveal opacity-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Four Steps to Your Dream University
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes your study abroad journey simple and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="reveal opacity-0 relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-card rounded-2xl p-8 h-full border card-hover">
                  <div className="text-5xl font-bold text-primary/10 mb-4">{step.number}</div>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 text-muted-foreground/30">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-muted/50">
        <div className="container-lg">
          <div className="text-center mb-16 reveal opacity-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and guidance to navigate your study abroad journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="reveal opacity-0 group bg-card rounded-2xl p-8 border card-hover cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-lg relative z-10 text-center">
          <div className="max-w-3xl mx-auto reveal opacity-0">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join thousands of students who found their dream university with StudyAbroadAI. Start your free consultation today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-white text-primary font-bold py-4 px-10 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-background">
        <div className="container-lg max-w-3xl">
          <div className="text-center mb-12 reveal opacity-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 reveal opacity-0">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-card rounded-xl border overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-lg pr-4">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container-lg py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 text-xl font-bold mb-4">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span>StudyAbroadAI</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                AI-powered guidance for Indian students pursuing global education. Your dream university is just a conversation away.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} StudyAbroadAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
