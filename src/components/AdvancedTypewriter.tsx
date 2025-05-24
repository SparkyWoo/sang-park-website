'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedTypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  variant?: 'classic' | 'morphing' | 'glitch' | 'wave';
  loop?: boolean;
  startDelay?: number;
  cursor?: boolean;
}

interface CharacterProps {
  char: string;
  index: number;
  variant: string;
}

function AnimatedCharacter({ char, index, variant }: CharacterProps) {
  const getVariantAnimation = () => {
    switch (variant) {
      case 'morphing':
        return {
          initial: { opacity: 0, scale: 0, rotateY: 90 },
          animate: { 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            transition: { 
              duration: 0.3,
              delay: index * 0.02,
              type: "spring",
              stiffness: 200
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0, 
            rotateY: 90,
            transition: { duration: 0.1 }
          }
        };
      
      case 'glitch':
        return {
          initial: { opacity: 0, x: -10, filter: 'blur(4px)' },
          animate: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
              duration: 0.2,
              delay: index * 0.01,
              ease: "easeOut"
            }
          },
          exit: {
            opacity: 0,
            x: 20,
            filter: 'blur(4px)',
            transition: { duration: 0.1 }
          }
        };
      
      case 'wave':
        return {
          initial: { opacity: 0, y: 20, rotateX: 90 },
          animate: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              duration: 0.4,
              delay: index * 0.03,
              type: "spring",
              stiffness: 150,
              damping: 12
            }
          },
          exit: {
            opacity: 0,
            y: 20,
            rotateX: 90,
            transition: { duration: 0.15 }
          }
        };
      
      default: // classic
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { duration: 0.1 }
          },
          exit: { opacity: 0, transition: { duration: 0.05 } }
        };
    }
  };

  const animation = getVariantAnimation();

  return (
    <motion.span
      className="inline-block"
      style={{ 
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom'
      }}
      {...animation}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export default function AdvancedTypewriter({
  texts,
  className = '',
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  variant = 'classic',
  loop = true,
  startDelay = 0,
  cursor = true
}: AdvancedTypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (startDelay > 0) {
      const timer = setTimeout(() => setIsStarted(true), startDelay);
      return () => clearTimeout(timer);
    } else {
      setIsStarted(true);
    }
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted || texts.length === 0) return;

    const currentFullText = texts[currentTextIndex];
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting) {
      if (currentText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, speed);
      } else {
        if (currentTextIndex === texts.length - 1 && !loop) {
          return;
        }
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, isStarted, texts, speed, deleteSpeed, pauseDuration, loop]);

  const characters = currentText.split('');

  return (
    <span className={`inline-block ${className}`}>
      <AnimatePresence mode="popLayout">
        {characters.map((char, index) => (
          <AnimatedCharacter
            key={`${currentTextIndex}-${index}-${char}`}
            char={char}
            index={index}
            variant={variant}
          />
        ))}
      </AnimatePresence>
      
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="inline-block ml-1 text-blue-400"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// Specialized typewriter components
export function MorphingTypewriter({ 
  texts, 
  className = '',
  speed = 80 
}: { 
  texts: string[];
  className?: string;
  speed?: number;
}) {
  return (
    <AdvancedTypewriter
      texts={texts}
      variant="morphing"
      speed={speed}
      deleteSpeed={40}
      pauseDuration={2500}
      className={className}
    />
  );
}

export function WaveTypewriter({ 
  texts, 
  className = '',
  speed = 120 
}: { 
  texts: string[];
  className?: string;
  speed?: number;
}) {
  return (
    <AdvancedTypewriter
      texts={texts}
      variant="wave"
      speed={speed}
      deleteSpeed={60}
      pauseDuration={3000}
      className={className}
    />
  );
} 