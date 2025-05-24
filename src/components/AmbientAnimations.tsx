'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AmbientAnimationsProps {
  children: React.ReactNode;
  type?: 'breathing' | 'floating' | 'glow' | 'pulse' | 'drift';
  intensity?: number;
  duration?: number;
  className?: string;
}

export default function AmbientAnimations({
  children,
  type = 'breathing',
  intensity = 1,
  duration = 4,
  className = ''
}: AmbientAnimationsProps) {
  // Breathing effect - gentle scale animation
  if (type === 'breathing') {
    return (
      <motion.div
        className={className}
        animate={{
          scale: [1, 1 + (0.02 * intensity), 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Floating effect - gentle vertical movement
  if (type === 'floating') {
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -10 * intensity, 0],
          rotate: [0, 1 * intensity, 0]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Glow effect - subtle opacity and shadow changes
  if (type === 'glow') {
    return (
      <motion.div
        className={className}
        animate={{
          opacity: [0.8, 1, 0.8],
          filter: [
            `drop-shadow(0 0 ${5 * intensity}px rgba(96, 165, 250, 0.3))`,
            `drop-shadow(0 0 ${15 * intensity}px rgba(96, 165, 250, 0.6))`,
            `drop-shadow(0 0 ${5 * intensity}px rgba(96, 165, 250, 0.3))`
          ]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Pulse effect - rhythmic scale changes
  if (type === 'pulse') {
    return (
      <motion.div
        className={className}
        animate={{
          scale: [1, 1.05 * intensity, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: duration * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Drift effect - slow random movement
  if (type === 'drift') {
    return (
      <motion.div
        className={className}
        animate={{
          x: [0, 5 * intensity, -3 * intensity, 2 * intensity, 0],
          y: [0, -3 * intensity, 5 * intensity, -2 * intensity, 0],
          rotate: [0, 0.5 * intensity, -0.3 * intensity, 0.2 * intensity, 0]
        }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Default fallback
  return <div className={className}>{children}</div>;
}

// Utility component for multiple ambient effects
export function MultiAmbient({ 
  children, 
  effects = ['breathing', 'floating'],
  className = ''
}: { 
  children: React.ReactNode;
  effects?: Array<'breathing' | 'floating' | 'glow' | 'pulse' | 'drift'>;
  className?: string;
}) {
  let wrappedChildren = children;

  // Wrap children with multiple ambient effects
  effects.forEach((effect, index) => {
    wrappedChildren = (
      <AmbientAnimations 
        key={index}
        type={effect} 
        intensity={0.5} 
        duration={4 + index}
        className={index === 0 ? className : ''}
      >
        {wrappedChildren}
      </AmbientAnimations>
    );
  });

  return <>{wrappedChildren}</>;
}

// CSS-based ambient animations for better performance
export function CSSAmbient({ 
  children, 
  type = 'breathing',
  className = ''
}: {
  children: React.ReactNode;
  type?: 'breathing' | 'floating' | 'glow' | 'pulse';
  className?: string;
}) {
  const animationClasses = {
    breathing: 'animate-breathing',
    floating: 'animate-floating', 
    glow: 'animate-glow',
    pulse: 'animate-pulse'
  };

  return (
    <div className={`${animationClasses[type]} ${className}`}>
      {children}
    </div>
  );
} 