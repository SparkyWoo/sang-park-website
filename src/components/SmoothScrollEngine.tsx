'use client';

import React, { useEffect, useCallback, useRef } from 'react';

interface SmoothScrollEngineProps {
  children: React.ReactNode;
  enabled?: boolean;
  intensity?: number;
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
    smoothScrollTo?: (target: string | HTMLElement, offset?: number) => void;
  }
}

const SmoothScrollEngine: React.FC<SmoothScrollEngineProps> = ({
  children,
  enabled = true,
  intensity = 1,
  duration = 800
}) => {
  const scrollTargetRef = useRef<ScrollTarget | null>(null);
  const isScrollingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Exponential ease-out function for natural deceleration
  const easeOutExpo = useCallback((t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }, []);

  // Enhanced easing with customizable intensity
  const customEasing = useCallback((t: number): number => {
    const baseEasing = easeOutExpo(t);
    // Apply intensity curve for more/less aggressive easing
    return Math.pow(baseEasing, 1 / intensity);
  }, [easeOutExpo, intensity]);

  // Calculate optimal duration based on distance
  const calculateDuration = useCallback((distance: number): number => {
    const baseDuration = duration;
    const minDuration = 150;
    const maxDuration = 600;
    
    // Logarithmic scaling for distance-based duration
    const scaledDuration = baseDuration * Math.log(distance / 100 + 1);
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

  // Main scroll function
  const smoothScrollTo = useCallback((targetElement: HTMLElement | string, offset: number = 0) => {
    if (!enabled) return;

    let element: HTMLElement | null = null;
    
    if (typeof targetElement === 'string') {
      element = document.querySelector(targetElement) as HTMLElement;
    } else {
      element = targetElement;
    }

    if (!element) return;

    // Cancel any existing scroll animation
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const currentY = window.scrollY;
    const targetY = element.offsetTop - offset;
    const distance = Math.abs(targetY - currentY);
    
    // Skip animation for very small distances
    if (distance < 10) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return;
    }

    const scrollDuration = calculateDuration(distance);
    
    scrollTargetRef.current = {
      element,
      targetY,
      startY: currentY,
      startTime: performance.now(),
      duration: scrollDuration,
      easing: customEasing
    };

    isScrollingRef.current = true;
    rafIdRef.current = requestAnimationFrame(animateScroll);
  }, [enabled, calculateDuration, customEasing, animateScroll]);

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
    if (enabled) {
      window.smoothScrollTo = smoothScrollTo;
    }
    
    return () => {
      if (window.smoothScrollTo === smoothScrollTo) {
        delete window.smoothScrollTo;
      }
    };
  }, [enabled, smoothScrollTo]);

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

// Hook for using smooth scroll in components
export const useSmoothScroll = () => {
  const smoothScrollTo = useCallback((target: string | HTMLElement, offset: number = 80) => {
    if (window.smoothScrollTo) {
      window.smoothScrollTo(target, offset);
    } else {
      // Fallback to browser smooth scroll
      if (typeof target === 'string') {
        const element = document.querySelector(target) as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return { smoothScrollTo };
}; 