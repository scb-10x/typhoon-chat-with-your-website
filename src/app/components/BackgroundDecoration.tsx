import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BackgroundDecoration: React.FC = () => {
  // Add state for particles to render them only on client side
  const [particles, setParticles] = useState<Array<{ top: string, left: string, duration: number, delay: number }>>([]);

  // Generate particles only on client side
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Top-right decoration */}
      <motion.div
        className="absolute -top-20 -right-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-fuchsia-500/15 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      {/* Bottom-left decoration */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-violet-500/15 via-fuchsia-500/15 to-purple-500/15 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Center decoration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] sm:w-[30rem] md:w-[40rem] h-[20rem] sm:h-[30rem] md:h-[40rem] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Additional decorative elements */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 3
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-red-500/10 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Floating particles - client-side only rendering */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500/30"
            style={{
              top: particle.top,
              left: particle.left,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mobile-only small decorations */}
      <motion.div
        className="sm:hidden absolute top-1/4 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="sm:hidden absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/15 to-pink-500/15 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Light beam effect */}
      <motion.div
        className="hidden md:block absolute top-0 right-1/4 w-1 h-[30vh] bg-gradient-to-b from-indigo-500/10 to-transparent blur-xl"
        animate={{
          height: ['20vh', '50vh', '20vh'],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="hidden md:block absolute bottom-0 left-1/3 w-1 h-[30vh] bg-gradient-to-t from-purple-500/10 to-transparent blur-xl"
        animate={{
          height: ['20vh', '40vh', '20vh'],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
};

export default BackgroundDecoration; 