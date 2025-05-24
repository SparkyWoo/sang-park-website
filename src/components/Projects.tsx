'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard3D from './ProjectCard3D';

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 1,
      title: 'LeetProduct',
      description: 'LeetCode for Product Managers - A platform designed to help PMs practice and improve their product thinking skills through structured challenges.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      status: 'Live' as const,
      link: 'https://leetproduct.com',
      image: '/images/projects/leetproduct.png'
    },
    {
      id: 2,
      title: 'VariantAB',
      description: 'AI-powered LinkedIn post analysis tool that helps content creators optimize their posts for better engagement and reach.',
      tech: ['Next.js', 'OpenAI API', 'Supabase', 'TypeScript'],
      status: 'Live' as const,
      link: 'https://www.variantab.com/',
      image: '/images/projects/variantab.png'
    },
    {
      id: 3,
      title: 'Quizings',
      description: 'Interactive personality tests and quizzes platform that helps users discover insights about themselves through engaging assessments.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'Live' as const,
      link: 'https://www.quizings.com/',
      image: '/images/projects/quizings.png'
    },
    {
      id: 4,
      title: 'BuyWhoa',
      description: 'Product discovery platform that curates and showcases innovative products, helping users find unique items and brands.',
      tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
      status: 'Live' as const,
      link: 'https://buywhoa.com/',
      image: '/images/projects/buywhoa.png'
    },
    {
      id: 5,
      title: 'ResumeHey',
      description: 'AI-powered resume optimization tool that helps job seekers improve their resumes with personalized feedback and suggestions.',
      tech: ['React', 'Python', 'OpenAI API', 'FastAPI'],
      status: 'Live' as const,
      link: 'https://www.resumehey.com/',
      image: '/images/projects/resumehey.png'
    },
    {
      id: 6,
      title: 'ReactionTimer',
      description: 'Mobile game that tests and improves reaction time skills through various challenges and exercises. Built for iOS and Android.',
      tech: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage'],
      status: 'Live' as const,
      link: '#',
      image: '/images/projects/reactiontimer.png'
    },
    {
      id: 7,
      title: 'WSIE',
      description: 'Restaurant recommendation app that helps users discover great dining experiences based on their preferences and location.',
      tech: ['React Native', 'Firebase', 'Google Maps API', 'Redux'],
      status: 'Live' as const,
      link: 'https://wsie.app/',
      image: '/images/projects/wsie.png'
    },
    {
      id: 8,
      title: 'Add to Calendar',
      description: 'Chrome extension that automatically detects event dates and countdown timers on Tock and other websites, adding an "Add to Calendar" button to never miss restaurant reservations.',
      tech: ['JavaScript', 'Chrome Extension API', 'Google Calendar API', 'HTML/CSS'],
      status: 'Live' as const,
      link: 'https://chromewebstore.google.com/detail/add-to-calendar/nnnijhodgdeliklkedjkkllglkgmmagk',
      image: '/images/projects/add-to-calendar.png'
    }
  ];

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !gridRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Title reveal animation
    gsap.fromTo(titleRef.current,
      {
        y: 100,
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

    // Staggered project cards animation
    const cards = gridRef.current.querySelectorAll('.project-card-3d');
    gsap.fromTo(cards,
      {
        y: 80,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Parallax effect for the section background
    gsap.to(sectionRef.current, {
      yPercent: -10,
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

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="py-24 section-padding bg-gray-900/20 relative overflow-hidden"
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      </div>
      
      <div className="container-max relative z-10">
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A collection of products and experiments I&apos;ve built to solve real problems and explore new ideas.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="project-card-3d">
              <ProjectCard3D project={project} />
            </div>
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
            className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
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