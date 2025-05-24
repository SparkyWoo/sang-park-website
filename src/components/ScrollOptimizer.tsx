'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface ScrollOptimizerProps {
  children: React.ReactNode;
  enabled?: boolean;
  enableGPUAcceleration?: boolean;
  enableLayoutContainment?: boolean;
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  scrollJank: number;
  lastFrameTime: number;
}

// Extend Window interface for our custom properties
declare global {
  interface Window {
    getScrollPerformance?: () => PerformanceMetrics;
  }
}

const ScrollOptimizer: React.FC<ScrollOptimizerProps> = ({
  children,
  enabled = true,
  enableGPUAcceleration = true,
  enableLayoutContainment = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    scrollJank: 0,
    lastFrameTime: performance.now()
  });
  const rafIdRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Performance monitoring
  const updatePerformanceMetrics = useCallback(() => {
    const now = performance.now();
    const frameTime = now - performanceRef.current.lastFrameTime;
    
    // Calculate FPS
    const fps = 1000 / frameTime;
    
    // Detect jank (frames taking longer than 16.67ms for 60fps)
    const jankThreshold = 16.67 * 1.5; // 25ms threshold
    const isJanky = frameTime > jankThreshold;
    
    performanceRef.current = {
      fps: Math.round(fps),
      frameTime: Math.round(frameTime * 100) / 100,
      scrollJank: isJanky ? performanceRef.current.scrollJank + 1 : performanceRef.current.scrollJank,
      lastFrameTime: now
    };

    // Log performance issues in development
    if (process.env.NODE_ENV === 'development' && isJanky) {
      console.warn(`Scroll jank detected: ${frameTime.toFixed(2)}ms frame time`);
    }
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!enabled) return;

    const now = performance.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    
    // Calculate scroll velocity for adaptive optimization
    scrollVelocityRef.current = timeSinceLastScroll > 0 ? 1000 / timeSinceLastScroll : 0;
    lastScrollTimeRef.current = now;
    
    // Mark as scrolling
    isScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scroll end timeout
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      
      // Re-enable any disabled optimizations after scrolling stops
      if (containerRef.current) {
        containerRef.current.style.pointerEvents = '';
      }
    }, 150);

    // Disable pointer events during fast scrolling to improve performance
    if (scrollVelocityRef.current > 10 && containerRef.current) {
      containerRef.current.style.pointerEvents = 'none';
    }

    // Update performance metrics
    updatePerformanceMetrics();
  }, [enabled, updatePerformanceMetrics]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    if (rafIdRef.current) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      handleScroll();
      rafIdRef.current = null;
    });
  }, [handleScroll]);

  // Apply GPU acceleration and layout containment
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    
    if (enableGPUAcceleration) {
      // Force GPU acceleration for smooth scrolling
      container.style.transform = 'translateZ(0)';
      container.style.willChange = 'scroll-position';
      container.style.backfaceVisibility = 'hidden';
      container.style.perspective = '1000px';
    }

    if (enableLayoutContainment) {
      // Use CSS containment for better performance
      container.style.contain = 'layout style paint';
    }

    // Optimize for smooth scrolling
    container.style.scrollBehavior = 'auto'; // We handle smooth scrolling ourselves
    container.style.overflowAnchor = 'none'; // Prevent scroll anchoring issues
    
    return () => {
      // Cleanup styles
      if (container) {
        container.style.transform = '';
        container.style.willChange = '';
        container.style.backfaceVisibility = '';
        container.style.perspective = '';
        container.style.contain = '';
        container.style.scrollBehavior = '';
        container.style.overflowAnchor = '';
      }
    };
  }, [enabled, enableGPUAcceleration, enableLayoutContainment]);

  // Set up scroll event listeners
  useEffect(() => {
    if (!enabled) return;

    // Use passive listeners for better performance
    const options = { passive: true };
    
    window.addEventListener('scroll', throttledScrollHandler, options);
    window.addEventListener('wheel', throttledScrollHandler, options);
    window.addEventListener('touchmove', throttledScrollHandler, options);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('wheel', throttledScrollHandler);
      window.removeEventListener('touchmove', throttledScrollHandler);
      
      // Cleanup RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // Cleanup timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, throttledScrollHandler]);

  // Fix zoom/scale issues between sections
  useEffect(() => {
    if (!enabled) return;

    const fixScaleIssues = () => {
      // Find all sections with potential scale transforms
      const sections = document.querySelectorAll('[data-section]');
      
      sections.forEach((section) => {
        const element = section as HTMLElement;
        
        // Reset any problematic transforms during scroll
        if (isScrollingRef.current) {
          const currentTransform = element.style.transform;
          
          // Check for scale transforms that might cause jank
          if (currentTransform.includes('scale')) {
            // Temporarily disable scale during scroll
            element.style.transform = currentTransform.replace(/scale\([^)]*\)/g, 'scale(1)');
            
            // Re-enable after scroll ends
            setTimeout(() => {
              if (!isScrollingRef.current) {
                element.style.transform = currentTransform;
              }
            }, 200);
          }
        }
      });
    };

    // Monitor for scale issues
    const scaleMonitor = setInterval(fixScaleIssues, 100);
    
    return () => clearInterval(scaleMonitor);
  }, [enabled]);

  // Adaptive quality based on performance
  useEffect(() => {
    if (!enabled) return;

    const adaptiveQuality = () => {
      const metrics = performanceRef.current;
      
      // If FPS drops below 45 or too much jank, reduce quality
      if (metrics.fps < 45 || metrics.scrollJank > 10) {
        document.documentElement.style.setProperty('--scroll-quality', 'low');
        
        // Disable expensive animations during poor performance
        document.body.classList.add('reduce-animations');
        
        if (process.env.NODE_ENV === 'development') {
          console.warn('Reducing scroll quality due to performance issues', metrics);
        }
      } else if (metrics.fps > 55 && metrics.scrollJank < 3) {
        document.documentElement.style.setProperty('--scroll-quality', 'high');
        document.body.classList.remove('reduce-animations');
      }
    };

    const qualityMonitor = setInterval(adaptiveQuality, 2000);
    
    return () => {
      clearInterval(qualityMonitor);
      document.documentElement.style.removeProperty('--scroll-quality');
      document.body.classList.remove('reduce-animations');
    };
  }, [enabled]);

  // Intersection Observer for section visibility optimization
  useEffect(() => {
    if (!enabled) return;

    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          // Element is visible - enable animations
          element.style.willChange = 'transform, opacity';
          element.classList.add('in-viewport');
        } else {
          // Element is not visible - disable expensive operations
          element.style.willChange = 'auto';
          element.classList.remove('in-viewport');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  // Expose performance metrics for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && enabled) {
      window.getScrollPerformance = () => performanceRef.current;
    }
    
    return () => {
      if (window.getScrollPerformance) {
        delete window.getScrollPerformance;
      }
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={containerRef}
      className="scroll-optimized"
      style={{
        // Base optimization styles
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
      }}
    >
      {children}
      
      {/* CSS for reduced animations during performance issues */}
      <style jsx global>{`
        .reduce-animations * {
          animation-duration: 0.1s !important;
          animation-delay: 0s !important;
          transition-duration: 0.1s !important;
          transition-delay: 0s !important;
        }
        
        .scroll-optimized {
          /* Optimize scrolling performance */
          scroll-behavior: auto;
          overflow-anchor: none;
        }
        
        .in-viewport {
          /* Marker class for visible elements */
        }
        
        /* Optimize transforms during scroll */
        @media (prefers-reduced-motion: no-preference) {
          .scroll-optimized * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        }
        
        /* High quality mode */
        :root[style*="--scroll-quality: high"] .scroll-optimized {
          scroll-behavior: smooth;
        }
        
        /* Low quality mode */
        :root[style*="--scroll-quality: low"] .scroll-optimized * {
          animation: none !important;
          transition: none !important;
        }
      `}</style>
    </div>
  );
};

export default ScrollOptimizer;

// Hook for accessing scroll performance metrics
export const useScrollPerformance = () => {
  const getMetrics = useCallback(() => {
    if (typeof window !== 'undefined' && window.getScrollPerformance) {
      return window.getScrollPerformance();
    }
    return null;
  }, []);

  return { getMetrics };
}; 