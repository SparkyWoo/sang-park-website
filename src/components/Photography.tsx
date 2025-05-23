'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const Photography = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Photography collection - add your photos here
  const photos = [
    {
      src: '/images/photography/photo-1.jpg',
      alt: 'Photography by Sang Park',
      title: 'Urban Landscape',
      location: 'City Center'
    },
    {
      src: '/images/photography/photo-2.jpg',
      alt: 'Photography by Sang Park',
      title: 'Golden Hour',
      location: 'Riverside'
    },
    {
      src: '/images/photography/photo-3.jpg',
      alt: 'Photography by Sang Park',
      title: 'Architecture',
      location: 'Downtown'
    },
    {
      src: '/images/photography/photo-4.jpg',
      alt: 'Photography by Sang Park',
      title: 'Street Life',
      location: 'Market District'
    },
    {
      src: '/images/photography/photo-5.jpg',
      alt: 'Photography by Sang Park',
      title: 'Nature',
      location: 'Mountain Trail'
    },
    {
      src: '/images/photography/photo-6.jpg',
      alt: 'Photography by Sang Park',
      title: 'Minimalism',
      location: 'Studio'
    }
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="photography" className="py-24 section-padding bg-gray-900/20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            <span className="text-gradient">Photography</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Capturing moments and stories through the lens. A collection of visual narratives 
            exploring light, composition, and the beauty in everyday scenes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Fallback placeholder for missing images */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-800">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">{photo.title}</p>
                    <p className="text-xs text-gray-600">{photo.location}</p>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-white font-light">{photo.title}</h3>
                <p className="text-gray-500 text-sm">{photo.location}</p>
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
            More photography coming soon. Always exploring new perspectives.
          </p>
          <motion.a
            href="https://www.flickr.com/photos/69237709@N05/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-700 rounded-lg text-white hover:border-gray-600 hover:bg-gray-900/40 transition-all duration-300"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <span>View Full Portfolio on Flickr</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photos.map(photo => ({
          src: photo.src,
          alt: photo.alt,
          title: photo.title,
          description: photo.location
        }))}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </section>
  );
};

export default Photography; 