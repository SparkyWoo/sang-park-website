'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScrollOptimizerProps {
  children: React.ReactNode;
}

const ScrollOptimizer: React.FC<ScrollOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // Optimize scroll performance
    const optimizeScroll = () => {
      // Disable smooth scrolling on elements that cause jank
      const problematicElements = document.querySelectorAll('[data-scroll-optimize]');
      problematicElements.forEach((element) => {
        (element as HTMLElement).style.scrollBehavior = 'auto';
      });

      // Add scroll optimization CSS
      const style = document.createElement('style');
      style.textContent = `
        /* Optimize scroll performance */
        * {
          scroll-behavior: auto !important;
        }
        
        /* Fix zoom/scale issues during scroll */
        .scroll-section {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform;
        }
        
        /* Prevent layout shifts */
        .scroll-section > * {
          transform: translateZ(0);
        }
        
        /* Smooth transitions without jank */
        .smooth-transition {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Fix About to Projects transition specifically */
        #about, #projects {
          isolation: isolate;
          contain: layout style paint;
        }
        
        /* Optimize animations during scroll */
        @media (prefers-reduced-motion: no-preference) {
          .scroll-optimized {
            animation-fill-mode: both;
            animation-duration: 0.6s;
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        }
        
        /* Prevent scroll jank on mobile */
        @media (max-width: 768px) {
          * {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }
        }
        
        /* Fix transform issues */
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        
        /* Optimize intersection observer targets */
        section[id] {
          scroll-margin-top: 80px;
          contain: layout;
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    };

    // Debounced scroll handler to prevent excessive updates
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Force GPU acceleration on scroll
        document.body.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => {
          document.body.style.transform = '';
        });
      }, 16); // 60fps
    };

    // Intersection Observer to optimize section transitions
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting) {
            // Optimize visible sections
            element.style.willChange = 'transform';
            element.classList.add('scroll-optimized');
          } else {
            // Clean up non-visible sections
            element.style.willChange = 'auto';
            element.classList.remove('scroll-optimized');
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: [0, 0.1, 0.5, 0.9, 1]
      }
    );

    // Initialize optimizations
    const cleanup = optimizeScroll();
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      section.classList.add('scroll-section');
      sectionObserver.observe(section);
    });

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      cleanup();
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <motion.div
      className="scroll-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollOptimizer; 