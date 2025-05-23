'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-12 section-padding border-t border-gray-800">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sang Park. All rights reserved.
          </div>
          
          <div className="text-gray-500 text-sm">
            Built with Next.js, TypeScript & Tailwind CSS
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 