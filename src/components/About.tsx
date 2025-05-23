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
                  [Placeholder Bio] I'm a Product Engineer passionate about building meaningful products 
                  that solve real problems. With a background in both technical development and product 
                  strategy, I bridge the gap between what's possible and what's needed.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  My journey spans across various domains - from developing LeetProduct (LeetCode for PMs) 
                  to exploring the intersection of technology and creativity through photography and writing.
                </p>

                <p className="text-lg leading-relaxed">
                  When I'm not building products, you'll find me capturing moments through my lens, 
                  writing about technology and product development, or exploring new ways to create 
                  value through code.
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
                    <span>Product Engineering & Development</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Full-Stack Application Building</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Product Strategy & Design</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Photography & Visual Storytelling</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-light mb-4 text-white">Currently</h3>
                <p className="text-gray-300">
                  Building innovative products and exploring the future of technology. 
                  Always open to interesting conversations and collaboration opportunities.
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