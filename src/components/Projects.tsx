'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const Projects = () => {
  const projects = [
    {
      title: 'LeetProduct',
      description: 'LeetCode for Product Managers - A platform designed to help PMs practice and improve their product thinking skills through structured challenges.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      status: 'Live',
      link: '#',
      image: '/images/projects/leetproduct.jpg'
    },
    {
      title: 'Project Alpha',
      description: 'An innovative solution for modern workflow automation. Built to streamline complex processes and improve team productivity.',
      tech: ['Next.js', 'Python', 'AWS', 'Redis'],
      status: 'In Development',
      link: '#',
      image: '/images/projects/project-alpha.jpg'
    },
    {
      title: 'Creative Studio',
      description: 'A digital platform connecting creators with opportunities. Features portfolio management, collaboration tools, and project matching.',
      tech: ['Vue.js', 'Firebase', 'Stripe', 'Tailwind'],
      status: 'Concept',
      link: '#',
      image: '/images/projects/creative-studio.jpg'
    }
  ];

  return (
    <section id="projects" className="py-24 section-padding bg-gray-900/20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A collection of products and experiments I've built to solve real problems and explore new ideas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300">
                <div className="relative h-48 bg-gray-800">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-light mb-3 text-white group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <motion.a
                    href={project.link}
                    className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">View Project</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            More projects coming soon. Always building something new.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            whileHover={{ y: -2 }}
          >
            <span>Let's build something together</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 