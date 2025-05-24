'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface TypographyMorpherProps {
  children: React.ReactNode;
  className?: string;
  initialWeight?: number;
  targetWeight?: number;
  initialSpacing?: number;
  targetSpacing?: number;
  trigger?: 'scroll' | 'hover' | 'inView';
  scrollRange?: [number, number];
  duration?: number;
}

export default function TypographyMorpher({
  children,
  className = '',
  initialWeight = 400,
  targetWeight = 700,
  initialSpacing = 0,
  targetSpacing = 0.05,
  trigger = 'scroll',
  scrollRange = [0, 0.5],
  duration = 0.5
}: TypographyMorpherProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animations for morphing
  const fontWeight = useSpring(initialWeight, {
    stiffness: 200,
    damping: 30,
    mass: 0.5
  });
  
  const letterSpacing = useSpring(initialSpacing, {
    stiffness: 200,
    damping: 30,
    mass: 0.5
  });

  // Scroll-based morphing
  useEffect(() => {
    if (trigger === 'scroll') {
      const unsubscribe = scrollYProgress.on('change', (latest) => {
        const progress = Math.max(0, Math.min(1, 
          (latest - scrollRange[0]) / (scrollRange[1] - scrollRange[0])
        ));
        
        const newWeight = initialWeight + (targetWeight - initialWeight) * progress;
        const newSpacing = initialSpacing + (targetSpacing - initialSpacing) * progress;
        
        fontWeight.set(newWeight);
        letterSpacing.set(newSpacing);
      });
      
      return unsubscribe;
    }
  }, [trigger, scrollYProgress, scrollRange, initialWeight, targetWeight, initialSpacing, targetSpacing, fontWeight, letterSpacing]);

  // Intersection Observer for inView trigger
  useEffect(() => {
    if (trigger === 'inView' && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fontWeight.set(targetWeight);
            letterSpacing.set(targetSpacing);
          } else {
            fontWeight.set(initialWeight);
            letterSpacing.set(initialSpacing);
          }
        },
        { threshold: 0.3 }
      );
      
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [trigger, initialWeight, targetWeight, initialSpacing, targetSpacing, fontWeight, letterSpacing]);

  // Hover effects
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      fontWeight.set(targetWeight);
      letterSpacing.set(targetSpacing);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      fontWeight.set(initialWeight);
      letterSpacing.set(initialSpacing);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        fontWeight: fontWeight,
        letterSpacing: letterSpacing.get() + 'em',
        fontVariationSettings: `"wght" ${fontWeight.get()}`,
        transition: `all ${duration}s ease-out`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Specialized morphing components
export function ScrollMorpher({ 
  children, 
  className = '',
  intensity = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <TypographyMorpher
      trigger="scroll"
      scrollRange={[0, 0.3 * intensity]}
      initialWeight={400}
      targetWeight={600 + (100 * intensity)}
      initialSpacing={0}
      targetSpacing={0.02 * intensity}
      className={className}
    >
      {children}
    </TypographyMorpher>
  );
}

export function HoverMorpher({ 
  children, 
  className = '',
  intensity = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <TypographyMorpher
      trigger="hover"
      initialWeight={400}
      targetWeight={500 + (200 * intensity)}
      initialSpacing={0}
      targetSpacing={0.05 * intensity}
      duration={0.3}
      className={className}
    >
      {children}
    </TypographyMorpher>
  );
}

export function InViewMorpher({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TypographyMorpher
      trigger="inView"
      initialWeight={300}
      targetWeight={600}
      initialSpacing={-0.02}
      targetSpacing={0.03}
      duration={0.8}
      className={className}
    >
      {children}
    </TypographyMorpher>
  );
} 