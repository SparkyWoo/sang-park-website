'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count: number;
  scrollVelocity: number;
  mousePosition: { x: number; y: number };
}

function ParticleSystem({ count, scrollVelocity, mousePosition }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count, viewport]);

  // Generate particle velocities
  const velocities = useMemo(() => {
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return velocities;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Base movement
      positions[i3] += velocities[i3] * (1 + scrollVelocity * 0.5);
      positions[i3 + 1] += velocities[i3 + 1] * (1 + scrollVelocity * 0.5);
      positions[i3 + 2] += velocities[i3 + 2];

      // Cursor interaction
      const particleX = positions[i3];
      const particleY = positions[i3 + 1];
      const mouseX = (mousePosition.x / window.innerWidth) * viewport.width - viewport.width / 2;
      const mouseY = -(mousePosition.y / window.innerHeight) * viewport.height + viewport.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(particleX - mouseX, 2) + Math.pow(particleY - mouseY, 2)
      );
      
      if (distance < 3) {
        const force = (3 - distance) / 3;
        const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
        positions[i3] += Math.cos(angle) * force * 0.02;
        positions[i3 + 1] += Math.sin(angle) * force * 0.02;
      }

      // Boundary wrapping
      if (positions[i3] > viewport.width) positions[i3] = -viewport.width;
      if (positions[i3] < -viewport.width) positions[i3] = viewport.width;
      if (positions[i3 + 1] > viewport.height) positions[i3 + 1] = -viewport.height;
      if (positions[i3 + 1] < -viewport.height) positions[i3 + 1] = viewport.height;
      if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
      if (positions[i3 + 2] < -5) positions[i3 + 2] = 5;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Subtle rotation based on scroll
    pointsRef.current.rotation.z = time * 0.001 + scrollVelocity * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

// Device capability detection
function getOptimalParticleCount(): number {
  if (typeof window === 'undefined') return 100;
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 60; // Fallback for no WebGL
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  if (isMobile || isLowEnd) return 80;
  return 150;
}

export default function WebGLParticleBackground() {
  const [particleCount, setParticleCount] = useState(100);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  const lastScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    console.log('WebGL Particle Background: Client-side rendering enabled');
    
    // Check WebGL support and set optimal particle count
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.log('WebGL not supported, falling back');
      setIsWebGLSupported(false);
      return;
    }
    
    console.log('WebGL supported, setting particle count');
    const count = getOptimalParticleCount();
    setParticleCount(count);
    console.log(`Particle count set to: ${count}`);

    // Scroll velocity tracking
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = Math.abs(currentScrollY - lastScrollY.current);
      scrollVelocityRef.current = Math.min(velocity * 0.1, 5);
      setScrollVelocity(scrollVelocityRef.current);
      lastScrollY.current = currentScrollY;
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Scroll velocity decay
    const velocityDecay = setInterval(() => {
      scrollVelocityRef.current *= 0.95;
      setScrollVelocity(scrollVelocityRef.current);
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(velocityDecay);
    };
  }, []);

  // Don't render on server side or if WebGL not supported
  if (!isClient || !isWebGLSupported) {
    console.log(`Not rendering: isClient=${isClient}, isWebGLSupported=${isWebGLSupported}`);
    // Return a simple canvas fallback
    return isClient ? <SimpleCanvasParticles /> : null;
  }

  console.log('Rendering WebGL particles with count:', particleCount);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
      >
        <ParticleSystem 
          count={particleCount} 
          scrollVelocity={scrollVelocity}
          mousePosition={mousePosition}
        />
      </Canvas>
    </div>
  );
}

// Simple canvas fallback
function SimpleCanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const particles: Array<{x: number, y: number, vx: number, vy: number}> = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ background: 'transparent' }}
    />
  );
} 