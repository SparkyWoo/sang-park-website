'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollTriggerProviderProps {
  children: React.ReactNode;
}

const ScrollTriggerProvider = ({ children }: ScrollTriggerProviderProps) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set up global GSAP defaults
    gsap.defaults({
      duration: 0.8,
      ease: "power2.out",
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
      markers: false, // Set to true for debugging
    });

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    isInitialized.current = true;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
};

export default ScrollTriggerProvider; 