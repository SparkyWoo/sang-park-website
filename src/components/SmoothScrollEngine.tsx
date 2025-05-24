'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface SmoothScrollEngineProps {
  children: React.ReactNode;
  enabled?: boolean;
  duration?: number;
}

interface ScrollTarget {
  element: HTMLElement;
  targetY: number;
  startY: number;
  startTime: number;
  duration: number;
  easing: (t: number) => number;
}

// Extend Window interface for our custom properties
declare global {
  interface Window {
    smoothScrollTo?: (target: string | HTMLElement, offset?: number, instant?: boolean) => void;
  }
}

const SmoothScrollEngine: React.FC<SmoothScrollEngineProps> = ({
  children,
  enabled = true,
  duration = 800
}) => {
  const scrollTargetRef = useRef<ScrollTarget | null>(null);
  const isScrollingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Exponential ease-out function for natural deceleration
  const easeOutExpo = useCallback((t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }, []);

  // Calculate optimal duration based on distance
  const calculateDuration = useCallback((distance: number): number => {
    const baseDuration = duration;
    const minDuration = 0;
    const maxDuration = 300;
    
    // For very short distances, make it instant
    if (distance < 50) return 0;
    
    // Logarithmic scaling for distance-based duration
    const scaledDuration = baseDuration * Math.log(distance / 100 + 1) * 0.5;
    return Math.max(minDuration, Math.min(maxDuration, scaledDuration));
  }, [duration]);

  // Smooth scroll animation function
  const animateScroll = useCallback((currentTime: number) => {
    if (!scrollTargetRef.current) return;

    const { startY, targetY, startTime, duration: scrollDuration, easing } = scrollTargetRef.current;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / scrollDuration, 1);
    
    // Apply easing function
    const easedProgress = easing(progress);
    const currentY = startY + (targetY - startY) * easedProgress;
    
    // Use smooth scrolling with transform for better performance
    window.scrollTo({
      top: currentY,
      behavior: 'auto' // We handle the easing ourselves
    });

    if (progress < 1) {
      rafIdRef.current = requestAnimationFrame(animateScroll);
    } else {
      // Scroll complete
      isScrollingRef.current = false;
      scrollTargetRef.current = null;
      rafIdRef.current = null;
    }
  }, []);

  // Smooth scroll to target with optional instant mode
  const smoothScrollTo = useCallback((target: string | HTMLElement, offset: number = 0, instant: boolean = false) => {
    if (!enabled) {
      // Fallback to native scroll
      const element = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
      if (element) {
        const elementTop = element.offsetTop - offset;
        window.scrollTo({ top: elementTop, behavior: instant ? 'auto' : 'smooth' });
      }
      return;
    }

    const element = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
    if (!element) return;

    const targetY = element.offsetTop - offset;
    const startY = window.scrollY;
    const distance = Math.abs(targetY - startY);

    // If instant mode or very small distance, scroll immediately
    if (instant || distance < 10) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return;
    }

    // Cancel any existing scroll
    if (scrollTargetRef.current) {
      scrollTargetRef.current = null;
    }

    const scrollDuration = calculateDuration(distance);
    
    // If calculated duration is 0, scroll instantly
    if (scrollDuration === 0) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return;
    }

    scrollTargetRef.current = {
      element: element as HTMLElement,
      targetY,
      startY,
      startTime: performance.now(),
      duration: scrollDuration,
      easing: easeOutExpo
    };

    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      animateScroll(performance.now());
    }
  }, [enabled, calculateDuration, easeOutExpo, animateScroll]);

  // Handle navigation clicks
  useEffect(() => {
    if (!enabled) return;

    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link && link.hash) {
        e.preventDefault();
        const targetId = link.hash;
        smoothScrollTo(targetId, 80); // Account for nav height
      }
    };

    // Handle navigation button clicks
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button[data-scroll-to]') as HTMLButtonElement;
      
      if (button) {
        e.preventDefault();
        const targetId = button.getAttribute('data-scroll-to');
        if (targetId) {
          smoothScrollTo(targetId, 80);
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleNavClick);
      document.removeEventListener('click', handleButtonClick);
      
      // Cleanup animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, smoothScrollTo]);

  // Expose scroll function to window for external use
  useEffect(() => {
    window.smoothScrollTo = smoothScrollTo;
    return () => {
      delete window.smoothScrollTo;
    };
  }, [smoothScrollTo]);

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      // Small delay to let browser handle the navigation
      setTimeout(() => {
        const hash = window.location.hash;
        if (hash) {
          smoothScrollTo(hash, 80);
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled, smoothScrollTo]);

  // Respect user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreference = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // User prefers reduced motion - disable smooth scrolling
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
        isScrollingRef.current = false;
        scrollTargetRef.current = null;
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreference);
    
    // Check initial preference
    if (mediaQuery.matches && enabled) {
      console.log('Smooth scrolling disabled due to user motion preferences');
    }

    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, [enabled]);

  return <>{children}</>;
};

export default SmoothScrollEngine;

// Hook to use smooth scroll functionality
export const useSmoothScroll = () => {
  const smoothScrollTo = useCallback((target: string | HTMLElement, offset: number = 0, instant: boolean = false) => {
    if (window.smoothScrollTo) {
      window.smoothScrollTo(target, offset, instant);
    } else {
      // Fallback to native scroll
      const element = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
      if (element) {
        const elementTop = element.offsetTop - offset;
        window.scrollTo({ top: elementTop, behavior: instant ? 'auto' : 'smooth' });
      }
    }
  }, []);

  return { smoothScrollTo };
}; 