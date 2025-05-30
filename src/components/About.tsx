'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimationOrchestrator from './AnimationOrchestrator';
import AmbientAnimations from './AmbientAnimations';
import { InteractiveTitle } from './InteractiveText';
import { SectionResponsiveText, HoverResponsiveText } from './DynamicFontWeight';
import { HighlightText, MagneticText } from './CursorFollowText';
import { InViewMorpher, HoverMorpher } from './TypographyMorpher';
import { FloatingElement, HoverTilt } from './Advanced3D';
import { RevealSection, ParallaxSection, NarrativeSection } from './StorytellingSection';

const skills = [
  'Product Strategy',
  'Full-Stack Development',
  'React & Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'UI/UX Design',
  'Data Analysis',
  'SQL',
  'Angel Investing'
];

export default function About() {
  return (
    <NarrativeSection speed={0.8}>
      <section id="about" className="py-20 bg-gray-800/30">
        <div className="container-max section-padding">
          <AnimationOrchestrator sequence="section" className="max-w-6xl mx-auto">
            {/* Section Header with Interactive Typography */}
            <ParallaxSection speed={0.4} direction="up">
              <AmbientAnimations type="breathing" intensity={0.3} duration={6}>
                <div className="text-center mb-16">
                  <FloatingElement speed={0.5}>
                    <InViewMorpher>
                      <SectionResponsiveText>
                        <InteractiveTitle 
                          variant="section"
                          className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                          About Me
                        </InteractiveTitle>
                      </SectionResponsiveText>
                    </InViewMorpher>
                  </FloatingElement>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                </div>
              </AmbientAnimations>
            </ParallaxSection>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Bio Section with Enhanced Typography */}
              <RevealSection direction="left" delay={0.2}>
                <AmbientAnimations type="floating" intensity={0.2} duration={8}>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <HoverTilt intensity={0.3}>
                        <HoverResponsiveText hoverWeight={600}>
                          <MagneticText radius={80}>
                            <HoverMorpher intensity={0.8}>
                              <h3 className="text-2xl font-bold text-white mb-4">
                                Building Products That Matter
                              </h3>
                            </HoverMorpher>
                          </MagneticText>
                        </HoverResponsiveText>
                      </HoverTilt>
                      <HighlightText radius={120}>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          I&apos;m a product engineer who believes in execution over perfection. 
                          While others debate, I build. My approach is simple: identify real problems, 
                          ship fast, iterate based on feedback.
                        </p>
                      </HighlightText>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <HighlightText radius={120}>
                        <p className="text-gray-300 leading-relaxed mb-6">
                          From LeetProduct (Leetcode for PMs) to VariantAB (AI-powered LinkedIn optimization), 
                          I focus on products that solve immediate pain points. Speed is my competitive advantage—I can 
                          go from idea to launched product faster than most teams can write a spec.
                        </p>
                      </HighlightText>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <HighlightText radius={120}>
                        <p className="text-gray-300 leading-relaxed">
                          When I&apos;m not building, I&apos;m angel investing in early-stage startups, 
                          helping other builders turn their ideas into reality. I believe the best products 
                          come from understanding real user problems, not following trends.
                        </p>
                      </HighlightText>
                    </motion.div>
                  </div>
                </AmbientAnimations>
              </RevealSection>

              {/* Skills Section with Interactive Effects */}
              <RevealSection direction="right" delay={0.4}>
                <AmbientAnimations type="breathing" intensity={0.1} duration={7}>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <FloatingElement speed={0.3}>
                        <HoverResponsiveText hoverWeight={600}>
                          <MagneticText radius={60}>
                            <HoverMorpher intensity={0.6}>
                              <h3 className="text-2xl font-bold text-white mb-8">
                                Skills & Expertise
                              </h3>
                            </HoverMorpher>
                          </MagneticText>
                        </HoverResponsiveText>
                      </FloatingElement>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {skills.map((skill, index) => (
                        <HoverTilt key={skill} intensity={0.4}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                            viewport={{ once: true }}
                            whileHover={{ 
                              scale: 1.05,
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                              transition: { duration: 0.2 }
                            }}
                            className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 cursor-default"
                          >
                            <AmbientAnimations type="glow" intensity={0.3} duration={4 + index * 0.2}>
                              <HoverResponsiveText hoverWeight={500}>
                                <MagneticText radius={40}>
                                  <span className="text-gray-200 font-medium">{skill}</span>
                                </MagneticText>
                              </HoverResponsiveText>
                            </AmbientAnimations>
                          </motion.div>
                        </HoverTilt>
                      ))}
                    </div>
                  </div>
                </AmbientAnimations>
              </RevealSection>
            </div>

            {/* Stats Section with Enhanced Typography */}
            <RevealSection direction="up" delay={0.6}>
              <AmbientAnimations type="drift" intensity={0.2} duration={12}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {[
                    { number: '10+', label: 'Products Launched' },
                    { number: '10+', label: 'Years Building' },
                    { number: '∞', label: 'Problems to Solve' }
                  ].map((stat, index) => (
                    <HoverTilt key={stat.label} intensity={0.5}>
                      <AmbientAnimations type="breathing" intensity={0.05} duration={6 + index * 2}>
                        <motion.div
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                        >
                          <FloatingElement speed={0.2 + index * 0.1}>
                            <HoverResponsiveText hoverWeight={700}>
                              <MagneticText radius={60}>
                                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                                  {stat.number}
                                </div>
                              </MagneticText>
                            </HoverResponsiveText>
                          </FloatingElement>
                          <HighlightText radius={80}>
                            <div className="text-gray-400 font-medium">
                              {stat.label}
                            </div>
                          </HighlightText>
                        </motion.div>
                      </AmbientAnimations>
                    </HoverTilt>
                  ))}
                </motion.div>
              </AmbientAnimations>
            </RevealSection>
          </AnimationOrchestrator>
        </div>
      </section>
    </NarrativeSection>
  );
} 