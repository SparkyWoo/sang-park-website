'use client';

import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-12 text-center">
            <span className="text-gradient">About</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="prose-dark">
                <p className="text-lg leading-relaxed mb-6">
                  I'm an entrepreneur, engineer, and product manager focused on building useful, thoughtful products quickly. I care about execution — getting things out the door, learning from real users, and refining fast.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  Much of my work centers on solving practical problems with simple tools, from AI-powered content and resume platforms to product discovery and quiz-based experiences. Whether it's a solo build or a team effort, I aim for clarity, speed, and impact.
                </p>

                <p className="text-lg leading-relaxed">
                  Outside of product work, I spend time on photography and writing — both as creative outlets and ways to sharpen how I think and communicate.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-light mb-4 text-white">What I Do</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Product Engineering & Iteration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Full-Stack Development</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Product Strategy & Launch</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Angel Investing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Photography & Writing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-light mb-4 text-white">Currently</h3>
                <p className="text-gray-300">
                  Building innovative products and exploring the future of technology. Always open to interesting conversations and collaboration opportunities.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 