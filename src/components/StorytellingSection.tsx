'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface StorytellingProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'reveal' | 'parallax' | 'narrative' | 'timeline' | 'immersive';
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  stagger?: number;
}

export default function StorytellingSection({
  children,
  className = '',
  variant = 'reveal',
  speed = 1,
  direction = 'up',
  stagger = 0.1
}: StorytellingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const x = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);

  // Smooth spring animations
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 1 });
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, mass: 1 });
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'parallax':
        return {
          y: direction === 'up' || direction === 'down' ? smoothY : 0,
          x: direction === 'left' || direction === 'right' ? smoothX : 0,
        };
      case 'narrative':
        return {
          opacity,
          scale: smoothScale,
        };
      case 'timeline':
        return {
          x: direction === 'left' ? smoothX : direction === 'right' ? smoothX : 0,
          opacity,
        };
      case 'immersive':
        return {
          y: smoothY,
          scale: smoothScale,
          opacity,
        };
      default: // reveal
        return {
          opacity: isInView ? 1 : 0,
        };
    }
  };

  const getInitialAnimation = () => {
    const distance = 100;
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getAnimateAnimation = () => {
    return { x: 0, y: 0, opacity: 1 };
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={getVariantStyles()}
      initial={variant === 'reveal' ? getInitialAnimation() : undefined}
      animate={variant === 'reveal' && isInView ? getAnimateAnimation() : undefined}
      transition={{
        duration: 0.8,
        delay: stagger,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

// Specialized storytelling components
export function RevealSection({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) {
  return (
    <StorytellingSection
      variant="reveal"
      direction={direction}
      stagger={delay}
      className={className}
    >
      {children}
    </StorytellingSection>
  );
}

export function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.5,
  direction = 'up' 
}: { 
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  return (
    <StorytellingSection
      variant="parallax"
      speed={speed}
      direction={direction}
      className={className}
    >
      {children}
    </StorytellingSection>
  );
}

export function NarrativeSection({ 
  children, 
  className = '',
  speed = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <StorytellingSection
      variant="narrative"
      speed={speed}
      className={className}
    >
      {children}
    </StorytellingSection>
  );
}

export function TimelineSection({ 
  children, 
  className = '',
  direction = 'left' 
}: { 
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
}) {
  return (
    <StorytellingSection
      variant="timeline"
      direction={direction}
      className={className}
    >
      {children}
    </StorytellingSection>
  );
}

export function ImmersiveSection({ 
  children, 
  className = '',
  speed = 0.8 
}: { 
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <StorytellingSection
      variant="immersive"
      speed={speed}
      className={className}
    >
      {children}
    </StorytellingSection>
  );
} 