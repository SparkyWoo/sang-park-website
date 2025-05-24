'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

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

  // Enhanced Project Card Component
  const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="bg-gray-900/40 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 relative"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{
            scale: 1.02,
            borderColor: "rgb(59 130 246 / 0.3)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Enhanced image container */}
          <div className="relative h-48 bg-gray-800 overflow-hidden">
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                className="object-cover"
              />
            </motion.div>
            
            {/* Animated status badge */}
            <motion.div 
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className={`px-3 py-1 text-xs rounded-full backdrop-blur-sm ${
                project.status === 'Live' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {project.status}
              </span>
            </motion.div>

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ transform: "translateZ(10px)" }}
            />
          </div>

          <div className="p-6" style={{ transform: "translateZ(20px)" }}>
            <motion.h3 
              className="text-xl font-light mb-3 text-white group-hover:text-blue-400 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {project.title}
            </motion.h3>
            
            <p className="text-gray-400 mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Enhanced tech stack */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-4"
              variants={{
                hover: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              whileHover="hover"
            >
              {project.tech.map((tech) => (
                <motion.span
                  key={tech}
                  className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                  variants={{
                    hover: {
                      y: -2,
                      scale: 1.05,
                    },
                  }}
                  whileHover={{
                    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Enhanced link */}
            <motion.a
              href={project.link}
              target={project.link.startsWith('http') ? '_blank' : undefined}
              rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors magnetic"
              data-cursor-text="Visit"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">
                {project.link.startsWith('http') ? 'Visit Site' : 'View Project'}
              </span>
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
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section id="projects" className="py-24 section-padding bg-gray-900/20 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      </div>
      
      <div className="container-max relative z-10">
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
            A collection of products and experiments I&apos;ve built to solve real problems and explore new ideas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
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
            className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors magnetic"
            data-cursor-text="Let's talk"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Let&apos;s build something together</span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 