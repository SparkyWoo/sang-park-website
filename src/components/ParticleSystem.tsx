'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleSystemProps {
  enabled?: boolean;
  count?: number;
  speed?: number;
  size?: number;
  colors?: string[];
  interactive?: boolean;
  className?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  enabled = true,
  count = 50,
  speed = 1,
  size = 2,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [isVisible, setIsVisible] = useState(false);

  // Create a single particle
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      size: Math.random() * size + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2
    };
  }, [speed, size, colors]);

  // Initialize particles
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = Array.from({ length: count }, () => createParticle(canvas));
  }, [count, createParticle]);

  // Update particle physics
  const updateParticle = useCallback((particle: Particle, canvas: HTMLCanvasElement, deltaTime: number) => {
    // Update position
    particle.x += particle.vx * deltaTime * 0.016;
    particle.y += particle.vy * deltaTime * 0.016;

    // Update life
    particle.life += deltaTime;

    // Mouse interaction
    if (interactive && mouseRef.current.isMoving) {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.5;
        particle.vy += (dy / distance) * force * 0.5;
      }
    }

    // Apply friction
    particle.vx *= 0.99;
    particle.vy *= 0.99;

    // Boundary conditions with wrapping
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Reset particle if life exceeded
    if (particle.life > particle.maxLife) {
      const newParticle = createParticle(canvas);
      Object.assign(particle, newParticle);
    }
  }, [interactive, createParticle]);

  // Render particles
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const deltaTime = 33; // 30fps for better performance

    // Update and render particles
    particlesRef.current.forEach((particle) => {
      updateParticle(particle, { width: canvas.width / dpr, height: canvas.height / dpr } as HTMLCanvasElement, deltaTime);

      // Calculate opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      const fadeIn = Math.min(lifeRatio * 4, 1);
      const fadeOut = lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1;
      const alpha = particle.opacity * fadeIn * fadeOut;

      // Render particle
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      if (alpha > 0.5) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Draw connections between nearby particles - Disabled for performance
    // if (interactive) {
    //   ctx.save();
    //   ctx.strokeStyle = colors[0];
    //   ctx.lineWidth = 0.5;
    //   ctx.globalAlpha = 0.3;

    //   for (let i = 0; i < particlesRef.current.length; i++) {
    //     for (let j = i + 1; j < particlesRef.current.length; j++) {
    //       const p1 = particlesRef.current[i];
    //       const p2 = particlesRef.current[j];
          
    //       const dx = p1.x - p2.x;
    //       const dy = p1.y - p2.y;
    //       const distance = Math.sqrt(dx * dx + dy * dy);
          
    //       if (distance < 80) {
    //         const alpha = (80 - distance) / 80;
    //         ctx.globalAlpha = alpha * 0.2;
    //         ctx.beginPath();
    //         ctx.moveTo(p1.x, p1.y);
    //         ctx.lineTo(p2.x, p2.y);
    //         ctx.stroke();
    //       }
    //     }
    //   }

    //   ctx.restore();
    // }

    animationIdRef.current = requestAnimationFrame(render);
  }, [updateParticle, colors, interactive]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    mouseRef.current.isMoving = true;

    // Reset moving flag after a delay
    setTimeout(() => {
      mouseRef.current.isMoving = false;
    }, 100);
  }, [interactive]);

  // Initialize and start animation
  useEffect(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    initParticles();
    setIsVisible(true);
    render();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [enabled, initParticles, render]);

  // Handle mouse events
  useEffect(() => {
    if (!interactive || !enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, enabled, handleMouseMove]);

  // Handle visibility changes for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animation when tab is not visible
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
      } else if (enabled && isVisible) {
        // Resume animation when tab becomes visible
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, isVisible, render]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (enabled && isVisible) {
        initParticles();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled, isVisible, initParticles]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-${interactive ? 'auto' : 'none'} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    />
  );
};

export default ParticleSystem; 