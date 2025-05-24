'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Typography3DProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  enableHoverEffects?: boolean;
}

export default function Typography3D({ 
  text, 
  className = '', 
  as: Component = 'h2',
  enableHoverEffects = true
}: Typography3DProps) {
  const letters = text.split('');

  const letterVariants = {
    hover: {
      rotateY: [0, 15, -15, 0],
      scale: [1, 1.1, 1.1, 1],
      z: [0, 20, 20, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hover: {
      transition: {
        staggerChildren: 0.03,
      }
    }
  };

  return (
    <motion.div
      variants={enableHoverEffects ? containerVariants : undefined}
      whileHover={enableHoverEffects ? "hover" : undefined}
      className="perspective-1000"
    >
      <Component
        className={`
          relative inline-block
          transform-gpu
          ${className}
        `}
        style={{
          transformStyle: 'preserve-3d',
          textShadow: `
            0 1px 0 rgba(255,255,255,0.1),
            0 2px 0 rgba(255,255,255,0.05),
            0 3px 0 rgba(0,0,0,0.1),
            0 4px 0 rgba(0,0,0,0.1),
            0 5px 0 rgba(0,0,0,0.1),
            0 6px 1px rgba(0,0,0,0.1),
            0 0 5px rgba(0,0,0,0.1),
            0 1px 3px rgba(0,0,0,0.3),
            0 3px 5px rgba(0,0,0,0.2),
            0 5px 10px rgba(0,0,0,0.25)
          `,
        }}
      >
        {enableHoverEffects ? (
          letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50% 0px',
              }}
              whileHover={{
                color: '#60a5fa',
                textShadow: `
                  0 0 10px rgba(96, 165, 250, 0.5),
                  0 0 20px rgba(96, 165, 250, 0.3),
                  0 0 30px rgba(96, 165, 250, 0.2)
                `,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))
        ) : (
          text
        )}
        
        {/* 3D depth effect */}
        <span
          className="absolute inset-0 -z-10 text-gray-800/30"
          style={{
            transform: 'translateZ(-10px) translateX(2px) translateY(2px)',
            filter: 'blur(1px)',
          }}
          aria-hidden="true"
        >
          {text}
        </span>
        
        {/* Additional depth layers */}
        <span
          className="absolute inset-0 -z-20 text-gray-900/20"
          style={{
            transform: 'translateZ(-20px) translateX(4px) translateY(4px)',
            filter: 'blur(2px)',
          }}
          aria-hidden="true"
        >
          {text}
        </span>
      </Component>
    </motion.div>
  );
} 