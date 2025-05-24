'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CursorFollowTextProps {
  children: React.ReactNode;
  className?: string;
  followStrength?: number;
  magneticRadius?: number;
  breathingIntensity?: number;
  highlightRadius?: number;
  variant?: 'follow' | 'magnetic' | 'breathing' | 'highlight';
}

export default function CursorFollowText({
  children,
  className = '',
  followStrength = 0.1,
  magneticRadius = 100,
  breathingIntensity = 0.02,
  highlightRadius = 150,
  variant = 'follow'
}: CursorFollowTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isNear, setIsNear] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Element position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  // Spring configurations for smooth movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const magneticConfig = { damping: 20, stiffness: 300, mass: 0.3 };

  // Smooth spring animations
  const smoothX = useSpring(x, variant === 'magnetic' ? magneticConfig : springConfig);
  const smoothY = useSpring(y, variant === 'magnetic' ? magneticConfig : springConfig);
  const smoothScale = useSpring(scale, springConfig);
  const smoothOpacity = useSpring(opacity, springConfig);

  // Color transformations based on proximity
  const hue = useTransform(smoothX, [-50, 50], [200, 280]);
  const brightness = useTransform(smoothScale, [1, 1.1], [1, 1.3]);

  useEffect(() => {
    if (!ref.current) return;

    const updateBounds = () => {
      const rect = ref.current!.getBoundingClientRect();
      setBounds({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!bounds.width) return;

      const distance = Math.sqrt(
        Math.pow(e.clientX - bounds.x, 2) + Math.pow(e.clientY - bounds.y, 2)
      );

      if (variant === 'follow') {
        // Subtle following effect
        const deltaX = (e.clientX - bounds.x) * followStrength;
        const deltaY = (e.clientY - bounds.y) * followStrength;
        x.set(deltaX);
        y.set(deltaY);
      }

      if (variant === 'magnetic') {
        // Magnetic attraction within radius
        if (distance < magneticRadius) {
          const force = (magneticRadius - distance) / magneticRadius;
          const deltaX = (e.clientX - bounds.x) * force * 0.3;
          const deltaY = (e.clientY - bounds.y) * force * 0.3;
          x.set(deltaX);
          y.set(deltaY);
          scale.set(1 + force * 0.1);
          setIsNear(true);
        } else {
          x.set(0);
          y.set(0);
          scale.set(1);
          setIsNear(false);
        }
      }

      if (variant === 'breathing') {
        // Breathing effect based on proximity
        if (distance < magneticRadius) {
          const force = (magneticRadius - distance) / magneticRadius;
          const breathingScale = 1 + Math.sin(Date.now() * 0.005) * breathingIntensity * force;
          scale.set(breathingScale);
          setIsNear(true);
        } else {
          scale.set(1);
          setIsNear(false);
        }
      }

      if (variant === 'highlight') {
        // Highlight effect with opacity and scale
        if (distance < highlightRadius) {
          const force = (highlightRadius - distance) / highlightRadius;
          scale.set(1 + force * 0.05);
          opacity.set(0.7 + force * 0.3);
          setIsNear(true);
        } else {
          scale.set(1);
          opacity.set(0.7);
          setIsNear(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [bounds, variant, followStrength, magneticRadius, breathingIntensity, highlightRadius, mouseX, mouseY, x, y, scale, opacity]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: smoothX,
        y: smoothY,
        scale: smoothScale,
        opacity: smoothOpacity,
        filter: variant === 'highlight' && isNear ? `hue-rotate(${hue.get()}deg) brightness(${brightness.get()})` : undefined,
        textShadow: isNear ? '0 0 20px rgba(96, 165, 250, 0.6)' : undefined,
        transition: 'text-shadow 0.3s ease'
      }}
    >
      {children}
    </motion.div>
  );
}

// Specialized components for different effects
export function FollowingText({ 
  children, 
  className = '',
  strength = 0.1 
}: { 
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  return (
    <CursorFollowText
      variant="follow"
      followStrength={strength}
      className={className}
    >
      {children}
    </CursorFollowText>
  );
}

export function MagneticText({ 
  children, 
  className = '',
  radius = 100 
}: { 
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <CursorFollowText
      variant="magnetic"
      magneticRadius={radius}
      className={className}
    >
      {children}
    </CursorFollowText>
  );
}

export function BreathingText({ 
  children, 
  className = '',
  intensity = 0.02 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <CursorFollowText
      variant="breathing"
      breathingIntensity={intensity}
      className={className}
    >
      {children}
    </CursorFollowText>
  );
}

export function HighlightText({ 
  children, 
  className = '',
  radius = 150 
}: { 
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <CursorFollowText
      variant="highlight"
      highlightRadius={radius}
      className={className}
    >
      {children}
    </CursorFollowText>
  );
}

// Advanced component that combines multiple effects
export function MultiEffectText({ 
  children, 
  className = '',
  effects = ['follow', 'highlight'] 
}: { 
  children: React.ReactNode;
  className?: string;
  effects?: Array<'follow' | 'magnetic' | 'breathing' | 'highlight'>;
}) {
  let wrappedChildren = children;

  effects.forEach((effect, index) => {
    const effectProps = {
      follow: { variant: 'follow' as const, followStrength: 0.05 },
      magnetic: { variant: 'magnetic' as const, magneticRadius: 80 },
      breathing: { variant: 'breathing' as const, breathingIntensity: 0.01 },
      highlight: { variant: 'highlight' as const, highlightRadius: 120 }
    };

    wrappedChildren = (
      <CursorFollowText
        key={index}
        {...effectProps[effect]}
        className={index === 0 ? className : ''}
      >
        {wrappedChildren}
      </CursorFollowText>
    );
  });

  return <>{wrappedChildren}</>;
} 