'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  status: 'Live' | 'In Development' | 'Completed';
}

const projects: Project[] = [
  {
    title: 'LeetProduct',
    description: 'LeetCode for Product Managers - Practice product management skills with real-world scenarios and case studies.',
    image: '/images/projects/leetproduct.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    link: 'https://leetproduct.com',
    status: 'Live'
  },
  {
    title: 'VariantAB',
    description: 'AI-powered LinkedIn post analysis tool that helps optimize content performance and engagement.',
    image: '/images/projects/variantab.png',
    technologies: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL'],
    link: 'https://www.variantab.com/',
    status: 'Live'
  },
  {
    title: 'Quizings',
    description: 'Personality tests and quizzes platform with engaging interactive experiences.',
    image: '/images/projects/quizings.png',
    technologies: ['Next.js', 'React', 'MongoDB', 'Tailwind CSS'],
    link: 'https://www.quizings.com/',
    status: 'Live'
  },
  {
    title: 'BuyWhoa',
    description: 'Product discovery platform helping users find unique and interesting products.',
    image: '/images/projects/buywhoa.png',
    technologies: ['React', 'Express.js', 'MySQL', 'AWS'],
    link: 'https://buywhoa.com/',
    status: 'Live'
  },
  {
    title: 'ResumeHey',
    description: 'AI-powered resume optimization tool that helps job seekers improve their resumes.',
    image: '/images/projects/resumehey.png',
    technologies: ['Next.js', 'OpenAI API', 'Stripe', 'Vercel'],
    link: 'https://www.resumehey.com/',
    status: 'Live'
  },
  {
    title: 'ReactionTimer',
    description: 'Mobile game testing reaction time and reflexes with engaging gameplay mechanics.',
    image: '/images/projects/reactiontimer.png',
    technologies: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage'],
    link: '#',
    status: 'Completed'
  },
  {
    title: 'WSIE',
    description: 'Restaurant recommendation app helping users discover great dining experiences.',
    image: '/images/projects/wsie.png',
    technologies: ['React Native', 'Firebase', 'Google Places API', 'Redux'],
    link: 'https://wsie.app/',
    status: 'Live'
  },
  {
    title: 'Add to Calendar',
    description: 'Chrome extension for Tock reservations that automatically adds restaurant bookings to your calendar.',
    image: '/images/projects/addtocalendar.png',
    technologies: ['JavaScript', 'Chrome Extension API', 'Calendar API'],
    link: 'https://chromewebstore.google.com/detail/add-to-calendar/nnnijhodgdeliklkedjkkllglkgmmagk',
    status: 'Live'
  }
];

const statusColors = {
  'Live': 'bg-green-500',
  'In Development': 'bg-yellow-500',
  'Completed': 'bg-blue-500'
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-gray-900/30">
      <div className="container-max section-padding">
        {/* Section Header - Clean and Simple */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            A collection of products I&apos;ve built, from concept to launch. 
            Each project represents a unique challenge and learning experience.
          </motion.p>
        </div>

        {/* Projects Grid - Simple and Fast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative"
        >
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-400 mb-4 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:text-blue-400 transition-colors duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        {project.link !== '#' && (
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 group"
          >
            <span>View Project</span>
            <motion.svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </motion.svg>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
} 