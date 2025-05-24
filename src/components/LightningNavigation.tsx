'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
}

const LightningNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const navItems: NavigationItem[] = [
    { name: 'About', href: '#about', icon: '👤' },
    { name: 'Projects', href: '#projects', icon: '🚀' },
    { name: 'Blog', href: '#blog', icon: '📝' },
    { name: 'Photography', href: '#photography', icon: '📸' },
    { name: 'Contact', href: '#contact', icon: '💬' },
  ];

  // Lightning-fast scroll with easing
  const lightningScroll = useCallback((targetId: string) => {
    const element = document.querySelector(targetId) as HTMLElement;
    if (!element) return;

    setIsTransitioning(true);

    // Get current scroll position and target position
    const currentY = window.scrollY;
    const targetY = element.offsetTop - 80; // Account for nav height
    const distance = Math.abs(targetY - currentY);
    
    // Calculate duration based on distance (faster for shorter distances)
    const baseDuration = Math.min(800, Math.max(300, distance * 0.5));
    
    // Custom easing function for lightning-fast feel
    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    
    const startTime = performance.now();
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / baseDuration, 1);
      const easedProgress = easeOutExpo(progress);
      
      const currentPosition = currentY + (targetY - currentY) * easedProgress;
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);

  // Enhanced intersection observer with better thresholds
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Better detection zones
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let activeId = 'hero';
      
      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeId = entry.target.id;
        }
      });
      
      if (maxRatio > 0.1) { // Only update if significantly visible
        setActiveSection(activeId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const keyMap: { [key: string]: string } = {
          '1': '#about',
          '2': '#projects',
          '3': '#blog',
          '4': '#photography',
          '5': '#contact',
        };
        
        if (keyMap[e.key]) {
          e.preventDefault();
          lightningScroll(keyMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightningScroll]);

  const handleNavClick = (href: string) => {
    lightningScroll(href);
  };

  return (
    <>
      {/* Lightning transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, rotate: 720 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo with lightning effect */}
            <motion.button
              onClick={() => lightningScroll('#hero')}
              className="relative text-xl font-bold text-white hover:text-blue-400 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredItem('logo')}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <span className="relative z-10">SP</span>
              {hoveredItem === 'logo' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>

            {/* Navigation Items with lightning effects */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.slice(1);
                const isHovered = hoveredItem === item.name;
                
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 rounded-lg ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredItem(item.name)}
                    onHoverEnd={() => setHoveredItem(null)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                  >
                    {/* Icon */}
                    <span className="mr-2 text-xs">{item.icon}</span>
                    
                    {/* Text */}
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Lightning hover effect */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                    
                    {/* Active indicator with lightning effect */}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    
                    {/* Keyboard shortcut hint */}
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-xs text-gray-300 rounded opacity-0 pointer-events-none"
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ⌘{index + 1}
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white hover:text-blue-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Lightning-fast progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
          style={{ width: progressWidth }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.1 }}
        />
      </motion.nav>

      {/* Quick navigation hints */}
      <motion.div
        className="fixed bottom-4 right-4 z-40 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 text-xs text-gray-400"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.9)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <span>⚡</span>
            <span>Lightning Navigation</span>
          </div>
          <div className="text-gray-500">
            Use ⌘1-5 for instant jumps
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LightningNavigation; 