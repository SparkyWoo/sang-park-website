'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface DynamicFontWeightProps {
  children: React.ReactNode;
  className?: string;
  baseWeight?: number;
  maxWeight?: number;
  minWeight?: number;
  scrollSensitivity?: number;
  hoverWeight?: number;
  variant?: 'scroll' | 'hover' | 'proximity' | 'section';
}

export default function DynamicFontWeight({
  children,
  className = '',
  baseWeight = 400,
  maxWeight = 900,
  minWeight = 300,
  scrollSensitivity = 1,
  hoverWeight = 600,
  variant = 'scroll'
}: DynamicFontWeightProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Scroll-based font weight
  const { scrollYProgress } = useScroll();
  const scrollWeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [minWeight, baseWeight, maxWeight]
  );

  // Smooth spring animation for weight changes
  const fontWeight = useSpring(baseWeight, {
    stiffness: 200,
    damping: 30,
    mass: 0.5
  });

  // Mouse position for proximity effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (variant === 'scroll') {
      const unsubscribe = scrollWeight.on('change', (latest) => {
        fontWeight.set(latest * scrollSensitivity);
      });
      return unsubscribe;
    }
  }, [scrollWeight, fontWeight, scrollSensitivity, variant]);

  useEffect(() => {
    if (variant === 'proximity') {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
          );
          
          const maxDistance = 200;
          const proximity = Math.max(0, (maxDistance - distance) / maxDistance);
          const weight = baseWeight + (proximity * (maxWeight - baseWeight));
          
          fontWeight.set(weight);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [variant, baseWeight, maxWeight, fontWeight, mouseX, mouseY]);

  useEffect(() => {
    if (variant === 'section') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fontWeight.set(maxWeight);
          } else {
            fontWeight.set(baseWeight);
          }
        },
        { threshold: 0.3 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }
  }, [variant, baseWeight, maxWeight, fontWeight]);

  const handleMouseEnter = () => {
    if (variant === 'hover') {
      fontWeight.set(hoverWeight);
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'hover') {
      fontWeight.set(baseWeight);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        fontWeight: fontWeight,
        fontVariationSettings: `"wght" ${fontWeight.get()}`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Specialized components for different use cases
export function ScrollResponsiveText({ 
  children, 
  className = '',
  intensity = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <DynamicFontWeight
      variant="scroll"
      baseWeight={400}
      maxWeight={700}
      minWeight={300}
      scrollSensitivity={intensity}
      className={className}
    >
      {children}
    </DynamicFontWeight>
  );
}

export function HoverResponsiveText({ 
  children, 
  className = '',
  hoverWeight = 600 
}: { 
  children: React.ReactNode;
  className?: string;
  hoverWeight?: number;
}) {
  return (
    <DynamicFontWeight
      variant="hover"
      baseWeight={400}
      hoverWeight={hoverWeight}
      className={className}
    >
      {children}
    </DynamicFontWeight>
  );
}

export function ProximityResponsiveText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DynamicFontWeight
      variant="proximity"
      baseWeight={400}
      maxWeight={800}
      className={className}
    >
      {children}
    </DynamicFontWeight>
  );
}

export function SectionResponsiveText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DynamicFontWeight
      variant="section"
      baseWeight={400}
      maxWeight={700}
      className={className}
    >
      {children}
    </DynamicFontWeight>
  );
} 