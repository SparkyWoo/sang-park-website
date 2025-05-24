'use client';

import React, { useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  github?: string;
  status: 'Live' | 'In Development' | 'Completed';
  tech: string[];
}

interface ProjectCard3DProps {
  project: Project;
}

const calc = (x: number, y: number, rect: DOMRect) => [
  -(y - rect.top - rect.height / 2) / 20,
  (x - rect.left - rect.width / 2) / 20,
  1.02,
];

const trans = (x: number, y: number, s: number) =>
  `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export default function ProjectCard3D({ project }: ProjectCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ xys, shadow }, api] = useSpring(() => ({
    xys: [0, 0, 1],
    shadow: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const bind = useGesture({
    onMove: ({ xy, hovering }) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const isHovering = hovering && xy[0] > rect.left && xy[0] < rect.right && xy[1] > rect.top && xy[1] < rect.bottom;
      
      if (isHovering) {
        const [rotX, rotY, scale] = calc(xy[0], xy[1], rect);
        api.start({
          xys: [rotX, rotY, scale],
          shadow: 30,
        });
        setIsHovered(true);
      } else {
        api.start({
          xys: [0, 0, 1],
          shadow: 10,
        });
        setIsHovered(false);
      }
    },
    onHover: ({ hovering }) => {
      if (!hovering) {
        api.start({
          xys: [0, 0, 1],
          shadow: 10,
        });
        setIsHovered(false);
      }
    },
  });

  const statusColors = {
    'Live': 'bg-green-500',
    'In Development': 'bg-yellow-500',
    'Completed': 'bg-blue-500',
  };

  return (
    <animated.div
      ref={ref}
      {...bind()}
      className="relative group cursor-pointer will-change-transform"
      style={{
        transform: xys.to(trans),
        filter: shadow.to(s => `drop-shadow(0 ${s}px ${s * 2}px rgba(0,0,0,0.3))`),
      }}
    >
      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
        {/* 3D Depth Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <animated.div
            style={{
              transform: xys.to((x, y) => `translate3d(${y * 2}px, ${x * 2}px, 0) scale(${isHovered ? 1.1 : 1})`),
            }}
            className="w-full h-full transition-transform duration-500"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </animated.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map((tech, techIndex) => (
              <animated.span
                key={tech}
                className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                style={{
                  transform: xys.to((x, y) => `translate3d(${y * 0.5}px, ${x * 0.5}px, 0)`),
                  transitionDelay: `${techIndex * 50}ms`,
                }}
              >
                {tech}
              </animated.span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-md border border-gray-700">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center hover:scale-105 active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              View Project
            </Link>
            
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* 3D Edge Highlight */}
        <animated.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-300 pointer-events-none"
          style={{
            transform: xys.to((x, y) => `translate3d(${y * 0.5}px, ${x * 0.5}px, 0)`),
          }}
        />
      </div>
    </animated.div>
  );
} 