'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from './SmoothScrollEngine';

interface SectionData {
  id: string;
  label: string;
  href: string;
  color: string;
  icon: string;
  isActive: boolean;
  isVisible: boolean;
  progress: number;
  offsetTop: number;
  height: number;
}

interface PageMiniMapProps {
  enabled?: boolean;
  position?: 'left' | 'right';
  showLabels?: boolean;
  showProgress?: boolean;
  autoHide?: boolean;
  compact?: boolean;
}

// Define sections with their metadata outside component
const sectionConfig = [
  { id: 'hero', label: 'Home', color: 'bg-purple-500', icon: '🏠' },
  { id: 'about', label: 'About', color: 'bg-blue-500', icon: '👨‍💻' },
  { id: 'projects', label: 'Projects', color: 'bg-green-500', icon: '🚀' },
  { id: 'blog', label: 'Blog', color: 'bg-yellow-500', icon: '📝' },
  { id: 'photography', label: 'Photography', color: 'bg-pink-500', icon: '📸' },
  { id: 'contact', label: 'Contact', color: 'bg-red-500', icon: '📧' }
];

const PageMiniMap: React.FC<PageMiniMapProps> = ({
  enabled = true,
  position = 'right',
  showLabels = true,
  showProgress = true,
  autoHide = true,
  compact = false
}) => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [totalHeight, setTotalHeight] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const { smoothScrollTo } = useSmoothScroll();

  // Update sections data and scroll progress
  useEffect(() => {
    if (!enabled) return;

    const updateSections = () => {
      const newSections: SectionData[] = [];
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate overall scroll progress
      const maxScroll = documentHeight - windowHeight;
      const currentProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setScrollProgress(Math.max(0, Math.min(1, currentProgress)));

      let activeFound = false;

      sectionConfig.forEach((config) => {
        const element = document.getElementById(config.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const offsetTop = element.offsetTop;
        const height = element.offsetHeight;
        
        // Check if section is visible in viewport
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        // Check if section is currently active (center of viewport)
        const isActive = !activeFound && rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3;
        if (isActive) activeFound = true;

        // Calculate progress through the section
        let progress = 0;
        if (rect.top <= 0 && rect.bottom >= windowHeight) {
          // Section fills viewport
          progress = Math.abs(rect.top) / Math.max(1, height - windowHeight);
        } else if (rect.top <= windowHeight && rect.bottom >= 0) {
          // Section partially visible
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          progress = visibleHeight / windowHeight;
        }
        
        progress = Math.max(0, Math.min(1, progress));

        newSections.push({
          id: config.id,
          label: config.label,
          href: `#${config.id}`,
          color: config.color,
          icon: config.icon,
          isActive,
          isVisible,
          progress,
          offsetTop,
          height
        });
      });

      setSections(newSections);
      setTotalHeight(documentHeight);

      // Auto-hide logic
      if (autoHide) {
        const shouldShow = scrollTop > windowHeight * 0.5;
        setIsVisible(shouldShow);
      } else {
        setIsVisible(true);
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateSections();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    updateSections();

    // Listen for scroll and resize events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSections, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSections);
    };
  }, [enabled, autoHide]);

  const handleSectionClick = (href: string) => {
    smoothScrollTo(href, 80, true);
  };

  const getPositionClasses = () => {
    const base = 'fixed top-1/2 transform -translate-y-1/2 z-40';
    return position === 'left' ? `${base} left-4` : `${base} right-4`;
  };

  const calculateSectionHeight = (section: SectionData) => {
    if (totalHeight === 0) return 20;
    const minHeight = compact ? 8 : 12;
    const maxHeight = compact ? 40 : 60;
    const proportionalHeight = (section.height / totalHeight) * 300;
    return Math.max(minHeight, Math.min(maxHeight, proportionalHeight));
  };

  if (!enabled || sections.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={mapRef}
          className={getPositionClasses()}
          initial={{ 
            opacity: 0, 
            x: position === 'left' ? -20 : 20,
            scale: 0.9 
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            x: position === 'left' ? -20 : 20,
            scale: 0.9 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`bg-black/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl ${
            compact ? 'p-2' : 'p-3'
          }`}>
            {/* Header */}
            {!compact && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Page Map
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">
                    {Math.round(scrollProgress * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Mini Map */}
            <div className={`relative ${compact ? 'w-8' : 'w-12'}`}>
              {/* Overall Progress Track */}
              <div className={`absolute left-0 top-0 ${compact ? 'w-1' : 'w-1.5'} bg-gray-700 rounded-full`}
                style={{ height: `${sections.length * (compact ? 12 : 16)}px` }}
              />
              
              {/* Overall Progress Indicator */}
              <motion.div
                className={`absolute left-0 top-0 ${compact ? 'w-1' : 'w-1.5'} bg-blue-400 rounded-full`}
                initial={{ height: 0 }}
                animate={{ height: `${scrollProgress * sections.length * (compact ? 12 : 16)}px` }}
                transition={{ duration: 0.1 }}
              />

              {/* Section Indicators */}
              <div className="relative space-y-1">
                {sections.map((section, index) => {
                  const sectionHeight = calculateSectionHeight(section);
                  
                  return (
                    <motion.div
                      key={section.id}
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSectionClick(section.href)}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Section Block */}
                      <div
                        className={`relative ${compact ? 'w-6 ml-2' : 'w-8 ml-3'} rounded-sm border transition-all duration-200 ${
                          section.isActive
                            ? `${section.color} border-white/50 shadow-lg`
                            : section.isVisible
                              ? `${section.color.replace('bg-', 'bg-opacity-60 bg-')} border-gray-500/50`
                              : 'bg-gray-600 border-gray-600/50'
                        }`}
                        style={{ height: `${compact ? 8 : sectionHeight}px` }}
                      >
                        {/* Progress Fill */}
                        {showProgress && section.isActive && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${section.progress * 100}%` }}
                            transition={{ duration: 0.1 }}
                            style={{ transformOrigin: 'bottom' }}
                          />
                        )}

                        {/* Section Icon */}
                        {!compact && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs opacity-80">
                              {section.icon}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tooltip */}
                      {showLabels && (
                        <AnimatePresence>
                          <motion.div
                            className={`absolute ${position === 'left' ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                          >
                            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-600">
                              {section.label}
                              {section.isActive && showProgress && (
                                <span className="ml-1 text-blue-400">
                                  ({Math.round(section.progress * 100)}%)
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Navigation */}
            {!compact && (
              <div className="mt-3 pt-2 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSectionClick('#hero')}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    title="Go to top"
                  >
                    ⬆
                  </button>
                  <span className="text-xs text-gray-600">
                    {sections.filter(s => s.isVisible).length}/{sections.length}
                  </span>
                  <button
                    onClick={() => handleSectionClick('#contact')}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    title="Go to bottom"
                  >
                    ⬇
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageMiniMap; 