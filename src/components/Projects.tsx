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
      link: 'https://leetproduct.com',
      image: '/images/projects/leetproduct.png'
    },
    {
      title: 'VariantAB',
      description: 'AI-powered LinkedIn post analysis tool that helps content creators optimize their posts for better engagement and reach.',
      tech: ['Next.js', 'OpenAI API', 'Supabase', 'TypeScript'],
      status: 'Live',
      link: 'https://www.variantab.com/',
      image: '/images/projects/variantab.png'
    },
    {
      title: 'Quizings',
      description: 'Interactive personality tests and quizzes platform that helps users discover insights about themselves through engaging assessments.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'Live',
      link: 'https://www.quizings.com/',
      image: '/images/projects/quizings.png'
    },
    {
      title: 'BuyWhoa',
      description: 'Product discovery platform that curates and showcases innovative products, helping users find unique items and brands.',
      tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
      status: 'Live',
      link: 'https://buywhoa.com/',
      image: '/images/projects/buywhoa.png'
    },
    {
      title: 'ResumeHey',
      description: 'AI-powered resume optimization tool that helps job seekers improve their resumes with personalized feedback and suggestions.',
      tech: ['React', 'Python', 'OpenAI API', 'FastAPI'],
      status: 'Live',
      link: 'https://www.resumehey.com/',
      image: '/images/projects/resumehey.png'
    },
    {
      title: 'ReactionTimer',
      description: 'Mobile game that tests and improves reaction time skills through various challenges and exercises. Built for iOS and Android.',
      tech: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage'],
      status: 'Live',
      link: '#',
      image: '/images/projects/reactiontimer.png'
    },
    {
      title: 'WSIE',
      description: 'Restaurant recommendation app that helps users discover great dining experiences based on their preferences and location.',
      tech: ['React Native', 'Firebase', 'Google Maps API', 'Redux'],
      status: 'Live',
      link: 'https://wsie.app/',
      image: '/images/projects/wsie.png'
    },
    {
      title: 'Add to Calendar',
      description: 'Chrome extension that automatically detects event dates and countdown timers on Tock and other websites, adding an "Add to Calendar" button to never miss restaurant reservations.',
      tech: ['JavaScript', 'Chrome Extension API', 'Google Calendar API', 'HTML/CSS'],
      status: 'Live',
      link: 'https://chromewebstore.google.com/detail/add-to-calendar/nnnijhodgdeliklkedjkkllglkgmmagk',
      image: '/images/projects/add-to-calendar.png'
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
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
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
                    target={project.link.startsWith('http') ? '_blank' : undefined}
                    rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">
                      {project.link.startsWith('http') ? 'Visit Site' : 'View Project'}
                    </span>
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