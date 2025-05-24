'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import AnimationOrchestrator from './AnimationOrchestrator';
import AmbientAnimations from './AmbientAnimations';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameRevealed, setNameRevealed] = useState(false);

  useEffect(() => {
    // Trigger name reveal after component mounts
    const timer = setTimeout(() => setNameRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const roles = ['Product Engineer', 'Builder', 'Creator', 'Problem Solver'];
    const currentRole = roles[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting]);

  // Split name into individual letters for animation
  const nameLetters = "Sang Park".split('');

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Background with ambient breathing */}
      <AmbientAnimations type="breathing" intensity={0.5} duration={6}>
        <ParticleBackground />
      </AmbientAnimations>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 z-0" />
      
      {/* Animated gradient overlay */}
      <AmbientAnimations type="glow" intensity={0.8} duration={8}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-1" />
      </AmbientAnimations>

      {/* Main Content with Orchestrated Animation */}
      <AnimationOrchestrator sequence="hero" className="relative z-10 text-center px-4">
        {/* Background Element for Phase 1 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl scale-150" />
        
        {/* Name with Letter-by-Letter Reveal - Phase 2 */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-2 perspective-1000">
            {nameLetters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  rotateX: -90,
                  scale: 0.5
                }}
                animate={nameRevealed ? { 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                  scale: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 15,
                  color: "#60a5fa",
                  transition: { duration: 0.2 }
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center bottom'
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h1>
          
          {/* Subtitle with ambient floating */}
          <AmbientAnimations type="floating" intensity={0.3} duration={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              I&apos;m a{' '}
              <span className="text-blue-400 font-semibold min-w-[200px] inline-block text-left">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="text-blue-400"
                >
                  |
                </motion.span>
              </span>
            </motion.div>
          </AmbientAnimations>
        </div>

        {/* Description - Phase 2 */}
        <AmbientAnimations type="breathing" intensity={0.2} duration={7}>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            I build products that solve real problems. From concept to launch, 
            I focus on execution speed and user impact.
          </motion.p>
        </AmbientAnimations>

        {/* CTA Buttons - Phase 3 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AmbientAnimations type="pulse" intensity={0.5} duration={3}>
            <motion.a
              href="#projects"
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 2.5,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              View My Work
            </motion.a>
          </AmbientAnimations>

          <AmbientAnimations type="drift" intensity={0.3} duration={10}>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 2.7,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "#60a5fa",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-600 hover:border-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Get In Touch
            </motion.a>
          </AmbientAnimations>
        </div>

        {/* Scroll Indicator - Phase 3 */}
        <AmbientAnimations type="floating" intensity={0.8} duration={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </AmbientAnimations>
      </AnimationOrchestrator>
    </section>
  );
} 