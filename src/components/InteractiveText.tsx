'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface InteractiveTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
  hoverScale?: number;
  colorShift?: boolean;
}

interface LetterProps {
  letter: string;
  index: number;
  hoverScale: number;
  colorShift: boolean;
  letterClassName?: string;
  onHover: (index: number) => void;
  onLeave: () => void;
}

function InteractiveLetter({
  letter,
  index,
  hoverScale,
  colorShift,
  letterClassName = '',
  onHover,
  onLeave
}: LetterProps) {

  const handleMouseEnter = () => {
    onHover(index);
  };

  const handleMouseLeave = () => {
    onLeave();
  };

  return (
    <motion.span
      className={`inline-block cursor-pointer select-none ${letterClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: hoverScale,
        rotateY: 15,
        color: colorShift ? "#60a5fa" : undefined,
        textShadow: '0 0 20px rgba(96, 165, 250, 0.8)',
        filter: 'brightness(1.3) saturate(1.2)',
      }}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom'
      }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  );
}

export default function InteractiveText({
  text,
  className = '',
  letterClassName = '',
  hoverScale = 1.2,
  colorShift = true
}: InteractiveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLetterHover = (index: number) => {
    // Ripple effect to neighboring letters
    if (containerRef.current) {
      const letters = containerRef.current.querySelectorAll('span');
      letters.forEach((letter, i) => {
        const distance = Math.abs(i - index);
        if (distance <= 2 && distance > 0) {
          const rippleStrength = (3 - distance) / 3;
          letter.style.transform = `scale(${1 + rippleStrength * 0.1}) translateY(${-rippleStrength * 2}px)`;
          letter.style.transition = 'transform 0.3s ease';
        }
      });
    }
  };

  const handleLetterLeave = () => {
    // Reset ripple effect
    if (containerRef.current) {
      const letters = containerRef.current.querySelectorAll('span');
      letters.forEach((letter) => {
        letter.style.transform = '';
        letter.style.transition = 'transform 0.5s ease';
      });
    }
  };

  const letters = text.split('');

  return (
    <div 
      ref={containerRef}
      className={`perspective-1000 ${className}`}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {letters.map((letter, index) => (
        <InteractiveLetter
          key={`${letter}-${index}`}
          letter={letter}
          index={index}
          hoverScale={hoverScale}
          colorShift={colorShift}
          letterClassName={letterClassName}
          onHover={handleLetterHover}
          onLeave={handleLetterLeave}
        />
      ))}
    </div>
  );
}

// Utility component for different text styles
export function InteractiveTitle({ 
  children, 
  className = '',
  variant = 'hero'
}: { 
  children: string;
  className?: string;
  variant?: 'hero' | 'section' | 'subtle';
}) {
  const variants = {
    hero: {
      hoverScale: 1.3,
      colorShift: true,
      letterClassName: 'font-bold'
    },
    section: {
      hoverScale: 1.15,
      colorShift: true,
      letterClassName: 'font-semibold'
    },
    subtle: {
      hoverScale: 1.1,
      colorShift: false,
      letterClassName: 'font-medium'
    }
  };

  const config = variants[variant];

  return (
    <InteractiveText
      text={children}
      className={className}
      {...config}
    />
  );
} 