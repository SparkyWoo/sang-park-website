'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogProps {
  posts: BlogPost[];
}

const Blog = ({ posts }: BlogProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Title reveal animation
    gsap.fromTo(titleRef.current,
      {
        y: 80,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Section parallax
    gsap.to(sectionRef.current, {
      yPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const BlogCard = ({ post, index }: { post: BlogPost, index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Truncate excerpt to ensure consistent card heights
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).trim() + '...';
    };

    return (
      <motion.div
        ref={cardRef}
        className="group h-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Link href={`/blog/${post.slug}`}>
          <motion.article 
            className="bg-gray-900/40 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:border-gray-700 cursor-pointer relative overflow-hidden flex flex-col"
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              borderColor: "rgb(59 130 246 / 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Date and reading time */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </span>
              </div>

              {/* Title with consistent height */}
              <motion.h3 
                className="text-xl font-light mb-3 text-white group-hover:text-blue-400 transition-colors"
                style={{ minHeight: '3.5rem', lineHeight: '1.75rem' }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {truncateText(post.title, 80)}
              </motion.h3>
              
              {/* Excerpt with fixed height */}
              <div className="flex-1 mb-4">
                <p className="text-gray-400 leading-relaxed" style={{ minHeight: '4.5rem', lineHeight: '1.5rem' }}>
                  {truncateText(post.excerpt, 120)}
                </p>
              </div>

              {/* Tags with consistent spacing */}
              <div className="mb-4" style={{ minHeight: '2rem' }}>
                {post.tags && post.tags.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    variants={{
                      hover: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                    whileHover="hover"
                  >
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <motion.span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                        variants={{
                          hover: {
                            y: -2,
                            scale: 1.05,
                          },
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Read more link - always at bottom */}
              <motion.div 
                className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors text-sm mt-auto"
                whileHover={{ x: 5 }}
              >
                <span>Read more</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.div>
            </div>
          </motion.article>
        </Link>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="blog" 
      className="py-24 section-padding relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/10 to-transparent" />
      
      <div className="container-max relative z-10">
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Blog</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Thoughts on product development, engineering, and building things that matter.
          </p>
        </motion.div>

        {/* Regular grid for blog posts - ensures consistent alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        {/* View all posts button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/blog">
            <motion.div
              className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 rounded-lg text-white hover:border-gray-600 hover:bg-gray-900/40 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span>View All Posts</span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog; 