'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimationOrchestrator from './AnimationOrchestrator';
import PhysicsAnimations from './PhysicsAnimations';
import AmbientAnimations from './AmbientAnimations';
import { InteractiveTitle } from './InteractiveText';
import { SectionResponsiveText, HoverResponsiveText } from './DynamicFontWeight';
import { MagneticText, HighlightText } from './CursorFollowText';
import { InViewMorpher, HoverMorpher } from './TypographyMorpher';

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
    link: '#',
    status: 'Completed'
  }
];

const statusColors = {
  'Live': 'bg-green-500',
  'In Development': 'bg-yellow-500',
  'Completed': 'bg-blue-500'
};

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header with Orchestrated Animation */}
        <AnimationOrchestrator sequence="text" className="text-center mb-16">
          <AmbientAnimations type="breathing" intensity={0.3} duration={6}>
            <InViewMorpher>
              <SectionResponsiveText>
                <InteractiveTitle 
                  variant="section"
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  Featured Projects
                </InteractiveTitle>
              </SectionResponsiveText>
            </InViewMorpher>
          </AmbientAnimations>
          <HighlightText radius={200}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A collection of products I&apos;ve built, from concept to launch. 
              Each project represents a unique challenge and learning experience.
            </p>
          </HighlightText>
        </AnimationOrchestrator>

        {/* Projects Grid with Staggered Animation */}
        <AnimationOrchestrator 
          sequence="cards" 
          stagger={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </AnimationOrchestrator>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <PhysicsAnimations type="hover" intensity={0.8} className="h-full">
      <AmbientAnimations type="breathing" intensity={0.1} duration={5 + index * 0.5}>
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col group"
          whileHover={{
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Project Image with Enhanced Hover Effect */}
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
              
              {/* Overlay with enhanced effects */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent"
              />
              
              {/* Status Badge with Physics */}
              <PhysicsAnimations type="elastic" intensity={0.5}>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>
              </PhysicsAnimations>
            </motion.div>
          </div>

          {/* Content with Ambient Effects */}
          <div className="p-6 flex-1 flex flex-col">
            <AmbientAnimations type="floating" intensity={0.2} duration={4 + index * 0.3}>
              <HoverResponsiveText hoverWeight={600}>
                <MagneticText radius={50}>
                  <HoverMorpher intensity={0.5}>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                  </HoverMorpher>
                </MagneticText>
              </HoverResponsiveText>
            </AmbientAnimations>
            
            <HighlightText radius={100}>
              <p className="text-gray-400 mb-4 flex-1 leading-relaxed">
                {project.description}
              </p>
            </HighlightText>

            {/* Tech Stack with Staggered Physics */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <PhysicsAnimations 
                  key={tech} 
                  type="elastic" 
                  intensity={0.3}
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: techIndex * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      transition: { duration: 0.2 }
                    }}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:text-blue-400 transition-colors duration-200 cursor-default"
                  >
                    {tech}
                  </motion.span>
                </PhysicsAnimations>
              ))}
            </div>

            {/* CTA Button with Enhanced Physics */}
            {project.link !== '#' && (
              <PhysicsAnimations type="elastic" intensity={1}>
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)",
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
              </PhysicsAnimations>
            )}
          </div>
        </motion.div>
      </AmbientAnimations>
    </PhysicsAnimations>
  );
} 