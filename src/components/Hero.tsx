'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import AnimationOrchestrator from './AnimationOrchestrator';
import AmbientAnimations from './AmbientAnimations';
import { InteractiveTitle } from './InteractiveText';
import { HoverResponsiveText, ProximityResponsiveText } from './DynamicFontWeight';
import { FollowingText } from './CursorFollowText';
import { WaveTypewriter } from './AdvancedTypewriter';
import { FloatingElement, HoverTilt } from './Advanced3D';
import { ImmersiveSection } from './StorytellingSection';

export default function Hero() {
  const [nameRevealed, setNameRevealed] = useState(false);

  useEffect(() => {
    // Trigger name reveal after component mounts
    const timer = setTimeout(() => setNameRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const roles = ['Product Engineer', 'Builder', 'Creator', 'Problem Solver'];

  return (
    <ImmersiveSection speed={0.6}>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Particle Background with ambient breathing */}
        <AmbientAnimations type="breathing" intensity={0.2} duration={8}>
          <ParticleBackground />
        </AmbientAnimations>

        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 z-0" />
        
        {/* Animated gradient overlay */}
        <AmbientAnimations type="glow" intensity={0.4} duration={12}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 z-1" />
        </AmbientAnimations>

        {/* Floating 3D Background Elements */}
        <div className="absolute inset-0 z-2">
          <FloatingElement speed={0.3}>
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/15 rounded-full blur-xl" />
          </FloatingElement>
          <FloatingElement speed={0.4}>
            <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/15 rounded-full blur-xl" />
          </FloatingElement>
          <FloatingElement speed={0.2}>
            <div className="absolute bottom-32 left-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-xl" />
          </FloatingElement>
          <FloatingElement speed={0.5}>
            <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-500/15 rounded-full blur-xl" />
          </FloatingElement>
        </div>

        {/* Main Content with Orchestrated Animation */}
        <AnimationOrchestrator sequence="hero" className="relative z-10 text-center px-4">
          {/* Background Element for Phase 1 */}
          <FloatingElement speed={0.1}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl scale-150" />
          </FloatingElement>
          
          {/* Interactive Name - Phase 2 */}
          <div className="mb-6" style={{ contain: 'layout style' }}>
            <HoverTilt intensity={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={nameRevealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-6xl md:text-8xl font-bold text-white mb-2"
                style={{ 
                  contain: 'layout style',
                  willChange: 'transform'
                }}
              >
                <FloatingElement speed={0.15}>
                  <InteractiveTitle 
                    variant="hero"
                    className="perspective-1000"
                  >
                    Sang Park
                  </InteractiveTitle>
                </FloatingElement>
              </motion.div>
            </HoverTilt>
            
            {/* Subtitle with dynamic font weight and cursor following */}
            <AmbientAnimations type="floating" intensity={0.2} duration={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-xl md:text-2xl text-gray-300 mb-8"
                style={{ 
                  contain: 'layout style',
                  willChange: 'transform'
                }}
              >
                <HoverTilt intensity={0.05}>
                  <HoverResponsiveText hoverWeight={500}>
                    <FollowingText strength={0.03}>
                      I&apos;m a{' '}
                      <span className="text-blue-400 font-semibold min-w-[200px] inline-block text-left">
                        <WaveTypewriter 
                          texts={roles}
                          speed={120}
                          className="text-blue-400"
                        />
                      </span>
                    </FollowingText>
                  </HoverResponsiveText>
                </HoverTilt>
              </motion.div>
            </AmbientAnimations>
          </div>

          {/* Description with proximity-responsive font weight - Phase 2 */}
          <AmbientAnimations type="breathing" intensity={0.1} duration={10}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ 
                contain: 'layout style',
                willChange: 'transform',
                minHeight: '4rem'
              }}
            >
              <FloatingElement speed={0.05}>
                <ProximityResponsiveText>
                  <FollowingText strength={0.02}>
                    I build products that solve real problems. From concept to launch, 
                    I focus on execution speed and user impact.
                  </FollowingText>
                </ProximityResponsiveText>
              </FloatingElement>
            </motion.div>
          </AmbientAnimations>

          {/* CTA Buttons with enhanced hover effects - Phase 3 */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center items-center w-full max-w-lg sm:max-w-none mx-auto px-4">
            <HoverTilt intensity={0.2}>
              <AmbientAnimations type="breathing" intensity={0.05} duration={12}>
                <motion.a
                  href="#projects"
                  initial={{ 
                    opacity: 0, 
                    scale: 0, 
                    rotate: 180,
                    boxShadow: "0 0px 0px rgba(59, 130, 246, 0)"
                  }}
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
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-center text-sm sm:text-base"
                >
                  View My Work
                </motion.a>
              </AmbientAnimations>
            </HoverTilt>

            <HoverTilt intensity={0.2}>
              <AmbientAnimations type="drift" intensity={0.1} duration={15}>
                <motion.a
                  href="#contact"
                  initial={{ 
                    opacity: 0, 
                    scale: 0, 
                    rotate: -180,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    borderColor: "rgb(75, 85, 99)"
                  }}
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
                  className="w-full sm:w-auto border-2 border-gray-600 hover:border-blue-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Get In Touch
                </motion.a>
              </AmbientAnimations>
            </HoverTilt>
          </div>

          {/* Scroll Indicator - Phase 3 */}
          <FloatingElement speed={0.3}>
            <AmbientAnimations type="floating" intensity={0.4} duration={6}>
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
          </FloatingElement>
        </AnimationOrchestrator>
      </section>
    </ImmersiveSection>
  );
} 