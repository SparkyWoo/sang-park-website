'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AnimationOrchestratorProps {
  children: React.ReactNode;
  sequence?: 'hero' | 'section' | 'cards' | 'text';
  delay?: number;
  stagger?: number;
  className?: string;
}

export default function AnimationOrchestrator({
  children,
  sequence = 'section',
  delay = 0,
  stagger = 0.1,
  className = ''
}: AnimationOrchestratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const elements = container.children;

    // Define animation sequences
    const sequences = {
      hero: () => {
        // Multi-layer hero entrance with perfect timing
        const tl = gsap.timeline({ delay });
        
        // Phase 1: Background elements (0-0.8s)
        tl.fromTo(elements[0], 
          { opacity: 0, scale: 0.8, rotateX: 45 },
          { opacity: 1, scale: 1, rotateX: 0, duration: 0.8, ease: "power2.out" }
        )
        
        // Phase 2: Main content (0.3-1.2s)
        .fromTo(Array.from(elements).slice(1, 3),
          { opacity: 0, y: 100, rotateY: -15 },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.9, stagger: 0.2, ease: "back.out(1.7)" },
          0.3
        )
        
        // Phase 3: Interactive elements (0.8-1.5s)
        .fromTo(Array.from(elements).slice(3),
          { opacity: 0, scale: 0, rotation: 180 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.7, stagger: 0.1, ease: "elastic.out(1, 0.5)" },
          0.8
        );

        return tl;
      },

      section: () => {
        // Elegant section entrance with depth
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Section animation triggered')
          }
        });

        tl.fromTo(container,
          { opacity: 0, y: 50, rotateX: 10, transformPerspective: 1000 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power2.out", delay }
        )
        .fromTo(Array.from(elements),
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger, ease: "power2.out" },
          0.2
        );

        return tl;
      },

      cards: () => {
        // Staggered card entrance with 3D effects
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        });

        Array.from(elements).forEach((element, index) => {
          tl.fromTo(element,
            { 
              opacity: 0, 
              y: 80, 
              rotateY: -45, 
              scale: 0.8,
              transformPerspective: 1000,
              transformOrigin: "center center -50px"
            },
            { 
              opacity: 1, 
              y: 0, 
              rotateY: 0, 
              scale: 1,
              duration: 0.8, 
              ease: "back.out(1.4)" 
            },
            delay + (index * stagger)
          );
        });

        return tl;
      },

      text: () => {
        // Character-by-character text reveal
        const textElements = Array.from(elements).filter(el => 
          el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P'
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        textElements.forEach((element, index) => {
          // Split text into characters
          const text = element.textContent || '';
          const chars = text.split('');
          element.innerHTML = chars.map(char => 
            `<span style="display: inline-block; opacity: 0; transform: translateY(20px) rotateX(-90deg);">${char === ' ' ? '&nbsp;' : char}</span>`
          ).join('');

          const charElements = element.querySelectorAll('span');
          
          tl.to(charElements, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.05,
            stagger: 0.02,
            ease: "back.out(2)",
          }, delay + (index * 0.3));
        });

        return tl;
      }
    };

    // Execute the selected sequence
    const animation = sequences[sequence]();

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [sequence, delay, stagger]);

  return (
    <div 
      ref={containerRef} 
      className={`transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
} 