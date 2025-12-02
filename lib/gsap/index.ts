import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Default animation settings
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// Common animation presets
export const fadeInUp = {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
};

export const fadeInDown = {
  y: -40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
};

export const fadeInLeft = {
  x: -40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
};

export const fadeInRight = {
  x: 40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
};

export const scaleIn = {
  scale: 0.9,
  opacity: 0,
  duration: 0.6,
  ease: 'back.out(1.7)',
};

export const staggerChildren = {
  amount: 0.3,
  from: 'start',
};

// Scroll trigger defaults
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
};

export { gsap, ScrollTrigger };
