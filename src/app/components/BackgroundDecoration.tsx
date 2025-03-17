import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Top-right decoration */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-fuchsia-400/10 blur-3xl"
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
        className="absolute -bottom-20 -left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-tr from-violet-400/10 via-fuchsia-400/10 to-purple-400/10 blur-3xl"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] sm:w-[30rem] md:w-[40rem] h-[20rem] sm:h-[30rem] md:h-[40rem] rounded-full bg-gradient-to-r from-indigo-400/5 via-purple-400/5 to-pink-400/5 blur-3xl"
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
        className="absolute top-1/3 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 blur-3xl"
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
        className="absolute bottom-1/3 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full bg-gradient-to-tr from-purple-400/5 via-pink-400/5 to-red-400/5 blur-3xl"
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
      
      {/* Mobile-only small decorations */}
      <motion.div 
        className="sm:hidden absolute top-1/4 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/10 blur-2xl"
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
        className="sm:hidden absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/10 blur-2xl"
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
    </div>
  );
};

export default BackgroundDecoration; 