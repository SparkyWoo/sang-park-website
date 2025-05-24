'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if custom cursor is disabled
    const isDisabled = document.body.hasAttribute('data-disable-cursor') || 
                      process.env.NODE_ENV === 'development'; // Disable in dev for easier debugging

    if (isDisabled) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('magnetic') ||
        target.hasAttribute('data-cursor-text')
      ) {
        setIsHovering(true);
        
        // Get custom cursor text if available
        const customText = target.getAttribute('data-cursor-text') || 
                          target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        setCursorText(customText || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    // Only add cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      document.addEventListener('mousemove', moveCursor);
      document.addEventListener('mousemove', handleElementHover);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      // Hide default cursor
      document.body.style.cursor = 'none';
      
      // Add cursor-none class to all elements
      const style = document.createElement('style');
      style.textContent = `
        *, *:hover, *:focus {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.removeEventListener('mousemove', moveCursor);
        document.removeEventListener('mousemove', handleElementHover);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.body.style.cursor = 'auto';
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [cursorX, cursorY, isMounted]);

  if (!isMounted) return null;

  const isTouchDevice = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const isDisabled = typeof document !== 'undefined' && 
    (document.body.hasAttribute('data-disable-cursor') || 
     process.env.NODE_ENV === 'development');

  if (isTouchDevice || isDisabled) return null;

  return (
    <>
      {/* Main cursor - small dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-50"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isVisible ? (isHovering ? 1.5 : 1) : 0,
          opacity: isVisible ? (isHovering ? 0.8 : 0.6) : 0,
        }}
        transition={{
          scale: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </motion.div>

      {/* Cursor ring - appears on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-40 border border-white/30 rounded-full"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Cursor text */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 text-white text-xs font-medium px-2 py-1 bg-black/80 backdrop-blur-sm rounded-md"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: 20, // Offset from cursor
            y: -30,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default MagneticCursor; 