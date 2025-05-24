'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from './ParticleBackground';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const texts = useMemo(() => [
    'Product Engineer',
    'Builder',
    'Creator',
    'Problem Solver'
  ], []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === current) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  // GSAP scroll animations
  useEffect(() => {
    if (!heroRef.current || !nameRef.current || !subtitleRef.current || !descriptionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax effect for the entire hero section
    gsap.to(heroRef.current, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Name scaling and fade effect
    gsap.to(nameRef.current, {
      scale: 0.8,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Subtitle and description fade
    gsap.to([subtitleRef.current, descriptionRef.current], {
      y: -100,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "center top",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Split name into letters for staggered animation
  const nameLetters = "Sang Park".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden"
    >
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0" />
      
      <div className="container-max text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated name with enhanced effects */}
          <motion.h1 
            ref={nameRef}
            className="text-6xl md:text-8xl lg:text-9xl font-light mb-6 perspective-1000"
          >
            <span className="inline-block">
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block text-gradient hover:text-blue-400 transition-colors duration-300"
                  style={{ 
                    transformOrigin: "50% 50% -50px",
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 15,
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>
          
          {/* Enhanced typewriter effect */}
          <motion.div 
            ref={subtitleRef}
            variants={subtitleVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 h-12 flex items-center justify-center"
          >
            <span className="text-gray-300 relative">
              {currentText}
              <motion.span
                className="inline-block w-0.5 h-8 bg-blue-400 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              />
            </span>
          </motion.div>

          {/* Description with enhanced animation */}
          <motion.p
            ref={descriptionRef}
            variants={descriptionVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Building products that matter. Turning ideas into reality through code, design, and relentless execution.
          </motion.p>

          {/* Enhanced scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="mt-12"
          >
            <motion.button
              onClick={() => {
                const element = document.querySelector('#about');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span className="text-sm font-light">Scroll to explore</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 