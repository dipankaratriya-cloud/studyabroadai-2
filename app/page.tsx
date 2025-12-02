'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
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

  // Refs for GSAP animations
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-badge',
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8 }
    )
    .fromTo('.hero-title',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.4'
    )
    .fromTo('.hero-subtitle',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.hero-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    )
    .fromTo('.hero-trust',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    );

    // Animate left college cards with stagger
    gsap.fromTo('.college-card-left-0',
      { x: -100, opacity: 0, rotate: -10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.2 }
    );
    gsap.fromTo('.college-card-left-1',
      { x: -100, opacity: 0, rotate: -10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.4 }
    );
    gsap.fromTo('.college-card-left-2',
      { x: -100, opacity: 0, rotate: -10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.6 }
    );

    // Animate right college cards with stagger
    gsap.fromTo('.college-card-right-0',
      { x: 100, opacity: 0, rotate: 10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.3 }
    );
    gsap.fromTo('.college-card-right-1',
      { x: 100, opacity: 0, rotate: 10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.5 }
    );
    gsap.fromTo('.college-card-right-2',
      { x: 100, opacity: 0, rotate: 10 },
      { x: 0, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.7 }
    );

    // Floating animation for left cards
    gsap.to('.college-card-left-0', {
      y: -15,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0
    });
    gsap.to('.college-card-left-1', {
      y: -12,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.5
    });
    gsap.to('.college-card-left-2', {
      y: -18,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1
    });

    // Floating animation for right cards
    gsap.to('.college-card-right-0', {
      y: -12,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.3
    });
    gsap.to('.college-card-right-1', {
      y: -16,
      duration: 3.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.8
    });
    gsap.to('.college-card-right-2', {
      y: -14,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.5
    });

  }, { scope: heroRef });

  // Stats animations with counter
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.stat-item',
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
          }
        );
      },
      once: true
    });
  }, { scope: statsRef });

  // Steps section animations
  useGSAP(() => {
    gsap.fromTo('.steps-header',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.steps-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.step-card',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Arrow animation
    gsap.fromTo('.step-arrow',
      { x: -10, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.5,
        scrollTrigger: {
          trigger: '.steps-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: stepsRef });

  // Features section animations
  useGSAP(() => {
    gsap.fromTo('.features-header',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.features-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.feature-card',
      { y: 80, opacity: 0, rotateX: 10 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          grid: [2, 3],
          from: 'start'
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: featuresRef });

  // CTA section animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo('.cta-content',
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    );

    // Parallax orbs
    gsap.to('.cta-orb-1', {
      y: -50,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.cta-orb-2', {
      y: 50,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }, { scope: ctaRef });

  // FAQ section animations
  useGSAP(() => {
    gsap.fromTo('.faq-header',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.faq-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.faq-item',
      { y: 30, opacity: 0, x: -20 },
      {
        y: 0,
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: faqRef });

  const features = [
    {
      icon: Target,
      title: 'AI Course Finder',
      desc: 'Get personalized university recommendations based on your profile, preferences, and career goals.',
      color: 'from-[#0984e3] to-[#00b4d8]'
    },
    {
      icon: FileText,
      title: 'SOP & LOR Review',
      desc: 'AI-powered analysis to perfect your statements and recommendation letters.',
      color: 'from-[#0984e3] to-[#0096c7]'
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
      color: 'from-[#0984e3] to-[#0077b6]'
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
    <div className="min-h-screen bg-background overflow-x-hidden">
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
            <span className="text-foreground">StudyAbroadAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="font-medium transition-colors animated-underline text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-medium transition-colors animated-underline text-muted-foreground hover:text-foreground"
            >
              How It Works
            </a>
            <Link
              href="/about"
              className="font-medium transition-colors animated-underline text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block font-medium px-4 py-2 rounded-lg transition-colors text-foreground hover:bg-accent"
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

      {/* Hero Section - Three Column Layout */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-background overflow-hidden">
        <div className="container-lg relative z-10 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[70vh]">

            {/* Left Column - Rotating College Images */}
            <div className="hidden lg:flex flex-col gap-6 items-center justify-center">
              <div className="college-carousel-left space-y-6">
                {[
                  { name: 'MIT', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/2560px-MIT_logo.svg.png', bg: 'bg-white' },
                  { name: 'Stanford', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/1200px-Seal_of_Leland_Stanford_Junior_University.svg.png', bg: 'bg-white' },
                  { name: 'Harvard', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/1200px-Harvard_University_coat_of_arms.svg.png', bg: 'bg-white' },
                ].map((college, i) => (
                  <div
                    key={i}
                    className={`college-card-left-${i} relative w-48 h-48 rounded-2xl ${college.bg} shadow-xl border border-gray-200 p-6 flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                  >
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-24 h-24 object-contain mb-3"
                    />
                    <span className="text-gray-800 font-semibold text-lg">{college.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column - Main Content */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm mb-8 opacity-0">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Study Abroad Guidance</span>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6 opacity-0">
                Your Journey to{' '}
                <span className="relative inline-block text-primary">
                  Global Education
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 4 298 10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>{' '}
                <br />Starts Here
              </h1>

              <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto opacity-0">
                Get personalized university recommendations, application guidance, and visa support - all powered by AI.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
                <Link
                  href="/signup"
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Start Free Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ChevronDown className="h-5 w-5" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
                <div className="hero-trust flex items-center gap-2 opacity-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Free to Start</span>
                </div>
                <div className="hero-trust flex items-center gap-2 opacity-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No Credit Card</span>
                </div>
                <div className="hero-trust flex items-center gap-2 opacity-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Right Column - Rotating College Images */}
            <div className="hidden lg:flex flex-col gap-6 items-center justify-center">
              <div className="college-carousel-right space-y-6">
                {[
                  { name: 'Oxford', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1200px-Oxford-University-Circlet.svg.png', bg: 'bg-white' },
                  { name: 'Cambridge', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/1200px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png', bg: 'bg-white' },
                  { name: 'Yale', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yale_University_logo.svg/2560px-Yale_University_logo.svg.png', bg: 'bg-white' },
                ].map((college, i) => (
                  <div
                    key={i}
                    className={`college-card-right-${i} relative w-48 h-48 rounded-2xl ${college.bg} shadow-xl border border-gray-200 p-6 flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                  >
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-24 h-24 object-contain mb-3"
                    />
                    <span className="text-gray-800 font-semibold text-lg">{college.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary/50" />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-card border-b">
        <div className="container-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item text-center opacity-0">
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
      <section ref={stepsRef} id="how-it-works" className="section bg-background">
        <div className="container-lg">
          <div className="steps-header text-center mb-16 opacity-0">
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

          <div className="steps-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="step-card relative opacity-0"
              >
                <div className="bg-card rounded-2xl p-8 h-full border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl font-bold text-primary/10 mb-4">{step.number}</div>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow hidden lg:block absolute top-1/2 -right-4 w-8 text-muted-foreground/30 opacity-0">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="section bg-muted/50">
        <div className="container-lg">
          <div className="features-header text-center mb-16 opacity-0">
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

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card group bg-card rounded-2xl p-8 border hover:border-primary/30 hover:shadow-xl cursor-pointer transition-all duration-300 opacity-0"
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="section gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="cta-orb-1 absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="cta-orb-2 absolute bottom-0 right-1/4 w-64 h-64 bg-[#0984e3]/20 rounded-full blur-3xl" />
        </div>

        <div className="container-lg relative z-10 text-center">
          <div className="cta-content max-w-3xl mx-auto opacity-0">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join thousands of students who found their dream university with StudyAbroadAI. Start your free consultation today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-white text-primary font-bold py-4 px-10 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="section bg-background">
        <div className="container-lg max-w-3xl">
          <div className="faq-header text-center mb-12 opacity-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="faq-list space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="faq-item group bg-card rounded-xl border overflow-hidden hover:border-primary/30 transition-colors opacity-0"
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
