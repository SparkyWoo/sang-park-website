'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: React.ReactNode[];
  className?: string;
  columnClassName?: string;
}

const MasonryGrid = ({ children, className = '', columnClassName = '' }: MasonryGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Staggered reveal animation for grid items
    const items = gridRef.current.querySelectorAll('.masonry-item');
    
    gsap.fromTo(items, 
      {
        y: 60,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [children]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div ref={gridRef}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={`masonry-grid ${className}`}
        columnClassName={`masonry-grid-column ${columnClassName}`}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className="masonry-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {child}
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryGrid; 