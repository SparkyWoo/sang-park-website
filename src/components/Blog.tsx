'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogProps {
  posts: BlogPost[];
}

const Blog = ({ posts }: BlogProps) => {
  return (
    <section id="blog" className="py-24 section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Blog</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Thoughts on product development, technology, and the creative process. 
            Sharing insights from building products and exploring new ideas.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-all duration-300 bg-gray-900/20 hover:bg-gray-900/40">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-2xl font-light mb-4 text-white group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <motion.div
                    className="inline-flex items-center space-x-2 text-white group-hover:text-gray-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">Read more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <motion.button
              className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 rounded-lg text-white hover:border-gray-600 hover:bg-gray-900/40 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span>View All Posts</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog; 