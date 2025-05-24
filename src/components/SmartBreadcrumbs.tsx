'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from './SmoothScrollEngine';

interface BreadcrumbItem {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  progress: number;
}

interface SmartBreadcrumbsProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showProgress?: boolean;
  autoHide?: boolean;
}

// Define sections with their metadata outside component
const sections = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'photography', label: 'Photography', href: '#photography' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({
  enabled = true,
  position = 'top-right',
  showProgress = true,
  autoHide = true
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const { smoothScrollTo } = useSmoothScroll();

  // Calculate section progress and update breadcrumbs
  useEffect(() => {
    if (!enabled) return;

    const updateBreadcrumbs = () => {
      const newBreadcrumbs: BreadcrumbItem[] = [];
      let foundActive = false;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate if section is in viewport and its progress
        const isInViewport = rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5;
        const isActive = isInViewport && !foundActive;
        
        if (isActive) {
          foundActive = true;
          setCurrentSection(section.id);
        }

        // Calculate scroll progress through the section
        let progress = 0;
        if (rect.top <= 0 && rect.bottom >= windowHeight) {
          // Section fills viewport
          progress = Math.abs(rect.top) / (element.offsetHeight - windowHeight);
        } else if (rect.top <= windowHeight && rect.bottom >= 0) {
          // Section partially visible
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          progress = visibleHeight / windowHeight;
        }
        
        progress = Math.max(0, Math.min(1, progress));

        // Only add to breadcrumbs if section has been reached or is active
        if (progress > 0 || isActive || rect.top <= windowHeight * 0.5) {
          newBreadcrumbs.push({
            id: section.id,
            label: section.label,
            href: section.href,
            isActive,
            progress: isActive ? progress : (rect.top <= 0 ? 1 : 0)
          });
        }
      });

      setBreadcrumbs(newBreadcrumbs);
      
      // Auto-hide logic
      if (autoHide) {
        const shouldShow = newBreadcrumbs.length > 1 && currentSection !== 'hero';
        setIsVisible(shouldShow);
      } else {
        setIsVisible(newBreadcrumbs.length > 0);
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateBreadcrumbs();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    updateBreadcrumbs();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateBreadcrumbs, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateBreadcrumbs);
    };
  }, [enabled, autoHide, currentSection]);

  const handleBreadcrumbClick = (href: string) => {
    smoothScrollTo(href, 80, true);
  };

  const getPositionClasses = () => {
    const base = 'fixed z-40';
    switch (position) {
      case 'top-left':
        return `${base} top-20 left-4`;
      case 'top-right':
        return `${base} top-20 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      default:
        return `${base} top-20 right-4`;
    }
  };

  if (!enabled || breadcrumbs.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className={`${getPositionClasses()} max-w-xs`}
          initial={{ opacity: 0, x: position.includes('right') ? 20 : -20, y: position.includes('bottom') ? 20 : -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: position.includes('right') ? 20 : -20, y: position.includes('bottom') ? 20 : -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg border border-gray-700/50 p-3 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Navigation
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">
                  {breadcrumbs.findIndex(b => b.isActive) + 1}/{breadcrumbs.length}
                </span>
              </div>
            </div>

            {/* Breadcrumb Trail */}
            <div className="space-y-1">
              {breadcrumbs.map((breadcrumb, index) => (
                <motion.button
                  key={breadcrumb.id}
                  onClick={() => handleBreadcrumbClick(breadcrumb.href)}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-all duration-200 group ${
                    breadcrumb.isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {/* Section Indicator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      breadcrumb.isActive 
                        ? 'bg-blue-400' 
                        : breadcrumb.progress > 0 
                          ? 'bg-gray-400' 
                          : 'bg-gray-600'
                    }`} />
                    
                    {/* Section Label */}
                    <span className="text-sm font-medium truncate">
                      {breadcrumb.label}
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  {showProgress && breadcrumb.isActive && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${breadcrumb.progress * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 min-w-0">
                        {Math.round(breadcrumb.progress * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Navigation Arrow */}
                  <motion.svg
                    className="w-3 h-3 text-gray-500 group-hover:text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-2 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleBreadcrumbClick('#hero')}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ↑ Top
                </button>
                <button
                  onClick={() => handleBreadcrumbClick('#contact')}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ↓ Bottom
                </button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SmartBreadcrumbs; 