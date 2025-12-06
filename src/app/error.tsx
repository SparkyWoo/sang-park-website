'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="container-max section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Error Code */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-light text-gradient mb-4">
              500
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={reset}
              className="btn-primary hover-lift focus-ring"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
            
            <Link href="/">
              <motion.div
                className="btn-secondary hover-lift focus-ring"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go Home
              </motion.div>
            </Link>
          </motion.div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800 text-left"
            >
              <h3 className="text-lg font-medium text-red-400 mb-2">
                Development Error Details:
              </h3>
              <pre className="text-sm text-gray-300 overflow-auto">
                {error.message}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 