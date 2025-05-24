'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Advanced3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  variant?: 'tilt' | 'rotate' | 'float' | 'perspective' | 'cube';
  trigger?: 'hover' | 'scroll' | 'mouse' | 'auto';
  speed?: number;
}

export default function Advanced3D({
  children,
  className = '',
  intensity = 1,
  variant = 'tilt',
  trigger = 'hover',
  speed = 1
}: Advanced3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Motion values for 3D transforms
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  const translateZ = useMotionValue(0);
  const scale = useMotionValue(1);

  // Spring configurations for smooth movement
  const springConfig = { 
    stiffness: 200 * speed, 
    damping: 30, 
    mass: 0.5 
  };

  // Smooth spring animations
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const smoothRotateZ = useSpring(rotateZ, springConfig);
  const smoothTranslateZ = useSpring(translateZ, springConfig);
  const smoothScale = useSpring(scale, springConfig);

  // Transform calculations based on variant
  const transform = useTransform(
    [smoothRotateX, smoothRotateY, smoothRotateZ, smoothTranslateZ, smoothScale],
    (values: number[]) => {
      const [rX, rY, rZ, tZ, s] = values;
      switch (variant) {
        case 'tilt':
          return `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(${s})`;
        case 'rotate':
          return `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`;
        case 'float':
          return `perspective(1000px) translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg) scale(${s})`;
        case 'perspective':
          return `perspective(${500 + tZ * 10}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
        case 'cube':
          return `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) rotateZ(${rZ}deg) translateZ(${tZ}px)`;
        default:
          return `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`;
      }
    }
  );

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
    if (trigger === 'mouse' || trigger === 'hover') {
      const handleMouseMove = (e: MouseEvent) => {
        if (!bounds.width) return;

        const x = (e.clientX - bounds.x) / bounds.width;
        const y = (e.clientY - bounds.y) / bounds.height;

        // Calculate rotation based on mouse position
        const maxRotation = 25 * intensity;
        const newRotateY = (x - 0.5) * maxRotation;
        const newRotateX = (0.5 - y) * maxRotation;

        if (trigger === 'mouse') {
          const distance = Math.sqrt(
            Math.pow(e.clientX - bounds.x, 2) + Math.pow(e.clientY - bounds.y, 2)
          );
          const maxDistance = Math.max(bounds.width, bounds.height);
          const proximity = Math.max(0, (maxDistance - distance) / maxDistance);

          if (proximity > 0.1) {
            rotateX.set(newRotateX * proximity);
            rotateY.set(newRotateY * proximity);
            scale.set(1 + proximity * 0.05 * intensity);
            translateZ.set(proximity * 20 * intensity);
          } else {
            rotateX.set(0);
            rotateY.set(0);
            scale.set(1);
            translateZ.set(0);
          }
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [bounds, trigger, intensity, rotateX, rotateY, scale, translateZ]);

  useEffect(() => {
    if (trigger === 'auto') {
      const animate = () => {
        const time = Date.now() * 0.001 * speed;
        
        switch (variant) {
          case 'float':
            rotateX.set(Math.sin(time) * 5 * intensity);
            rotateY.set(Math.cos(time * 0.8) * 5 * intensity);
            translateZ.set(Math.sin(time * 1.2) * 10 * intensity);
            break;
          case 'rotate':
            rotateX.set(Math.sin(time) * 10 * intensity);
            rotateY.set(Math.cos(time) * 10 * intensity);
            rotateZ.set(Math.sin(time * 0.5) * 5 * intensity);
            break;
          case 'cube':
            rotateX.set(time * 20 * intensity);
            rotateY.set(time * 30 * intensity);
            break;
          default:
            rotateX.set(Math.sin(time) * 3 * intensity);
            rotateY.set(Math.cos(time * 0.7) * 3 * intensity);
        }
      };

      const interval = setInterval(animate, 16); // 60fps
      return () => clearInterval(interval);
    }
  }, [trigger, variant, intensity, speed, rotateX, rotateY, rotateZ, translateZ]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      const maxRotation = 15 * intensity;
      rotateX.set(Math.random() * maxRotation - maxRotation / 2);
      rotateY.set(Math.random() * maxRotation - maxRotation / 2);
      scale.set(1 + 0.05 * intensity);
      translateZ.set(10 * intensity);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' || trigger === 'mouse') {
      rotateX.set(0);
      rotateY.set(0);
      rotateZ.set(0);
      scale.set(1);
      translateZ.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Specialized 3D components
export function TiltCard({ 
  children, 
  className = '',
  intensity = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <Advanced3D
      variant="tilt"
      trigger="mouse"
      intensity={intensity}
      className={className}
    >
      {children}
    </Advanced3D>
  );
}

export function FloatingElement({ 
  children, 
  className = '',
  speed = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <Advanced3D
      variant="float"
      trigger="auto"
      intensity={0.5}
      speed={speed}
      className={className}
    >
      {children}
    </Advanced3D>
  );
}

export function RotatingCube({ 
  children, 
  className = '',
  speed = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <Advanced3D
      variant="cube"
      trigger="auto"
      intensity={1}
      speed={speed}
      className={className}
    >
      {children}
    </Advanced3D>
  );
}

export function HoverTilt({ 
  children, 
  className = '',
  intensity = 1 
}: { 
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <Advanced3D
      variant="tilt"
      trigger="hover"
      intensity={intensity}
      className={className}
    >
      {children}
    </Advanced3D>
  );
} 