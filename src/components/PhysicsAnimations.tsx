'use client';

import React, { useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';

interface PhysicsAnimationsProps {
  children: React.ReactNode;
  type?: 'hover' | 'elastic' | 'magnetic';
  intensity?: number;
  className?: string;
}

export default function PhysicsAnimations({
  children,
  type = 'hover',
  intensity = 1,
  className = ''
}: PhysicsAnimationsProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Physics configurations
  const physicsConfigs = {
    gentle: { mass: 1, tension: 280, friction: 60 },
    bouncy: { mass: 1, tension: 300, friction: 10 },
    elastic: { mass: 1, tension: 400, friction: 30 },
    magnetic: { mass: 0.5, tension: 500, friction: 40 }
  };

  // Always call hooks - determine config based on type
  const config = type === 'hover' ? physicsConfigs.elastic :
                type === 'elastic' ? physicsConfigs.bouncy :
                physicsConfigs.magnetic;

  const [{ transform }, api] = useSpring(() => ({
    transform: type === 'hover' ? 'scale(1) rotateX(0deg) rotateY(0deg)' :
               type === 'elastic' ? 'scale(1) rotate(0deg)' :
               'translate(0px, 0px) scale(1)',
    config
  }));

  const bind = useGesture({
    onMove: ({ xy, hovering }) => {
      if (type === 'hover') {
        if (!ref.current || !hovering) return;
        
        const rect = ref.current.getBoundingClientRect();
        const x = (xy[0] - rect.left - rect.width / 2) / rect.width;
        const y = (xy[1] - rect.top - rect.height / 2) / rect.height;
        
        const scale = 1 + (0.05 * intensity);
        const rotateX = -y * 10 * intensity;
        const rotateY = x * 10 * intensity;
        
        api.start({
          transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        });
      } else if (type === 'magnetic') {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(xy[0] - centerX, 2) + Math.pow(xy[1] - centerY, 2)
        );
        
        const magneticRadius = 100 * intensity;
        
        if (distance < magneticRadius && hovering) {
          const force = (magneticRadius - distance) / magneticRadius;
          const angle = Math.atan2(xy[1] - centerY, xy[0] - centerX);
          
          const x = Math.cos(angle) * force * 20 * intensity;
          const y = Math.sin(angle) * force * 20 * intensity;
          const scale = 1 + force * 0.1 * intensity;
          
          api.start({
            transform: `translate(${x}px, ${y}px) scale(${scale})`
          });
        } else {
          api.start({ transform: 'translate(0px, 0px) scale(1)' });
        }
      }
    },
    onHover: ({ hovering }) => {
      if (type === 'hover' && !hovering) {
        api.start({
          transform: 'scale(1) rotateX(0deg) rotateY(0deg)'
        });
      } else if (type === 'elastic') {
        if (hovering) {
          api.start({ transform: 'scale(1.02) rotate(0deg)' });
        } else {
          api.start({ transform: 'scale(1) rotate(0deg)' });
        }
      }
    },
    onPointerDown: () => {
      if (type === 'elastic') {
        api.start({ transform: 'scale(0.95) rotate(-2deg)' });
      }
    },
    onPointerUp: () => {
      if (type === 'elastic') {
        api.start({ transform: 'scale(1.05) rotate(2deg)' });
        setTimeout(() => {
          api.start({ transform: 'scale(1) rotate(0deg)' });
        }, 100);
      }
    }
  });

  return (
    <animated.div
      ref={ref}
      {...bind()}
      style={{
        transform,
        transformStyle: type === 'hover' ? 'preserve-3d' : undefined,
        perspective: type === 'hover' ? 1000 : undefined
      }}
      className={className}
    >
      {children}
    </animated.div>
  );
}

// Utility hook for custom physics animations
export function usePhysicsSpring(config = {}) {
  return useSpring({
    config: { mass: 1, tension: 280, friction: 60, ...config }
  });
} 