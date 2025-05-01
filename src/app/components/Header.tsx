import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '../lib/i18n';
import { FaGithub } from 'react-icons/fa6';

const Header = () => {
  const { t } = useI18n();
  const [showGithubButton, setShowGithubButton] = useState(false);

  useEffect(() => {
    const checkReleaseDate = () => {
      const releaseDate = new Date('2025-05-08T17:00:01Z');
      const currentDate = new Date();
      setShowGithubButton(currentDate >= releaseDate);
    };

    // Check immediately
    checkReleaseDate();

    // Set up interval to check periodically (every minute)
    const intervalId = setInterval(checkReleaseDate, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="w-full py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern" id="header-container">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/30 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full filter blur-2xl opacity-40 translate-y-1/2 -translate-x-1/3 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="flex flex-col sm:flex-row items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="w-14 h-14 flex items-center justify-center sm:mr-4 mb-3 sm:mb-0 glow-effect rounded-full p-1 bg-white/80"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                id="header-logo-container"
              >
                <Image
                  src="/images/logo.svg"
                  alt="Chat With Your Website Logo"
                  width={50}
                  height={50}
                  className="w-full h-full object-contain"
                  priority
                  id="header-logo"
                />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                id="demo-flag"
              >
                DEMO
              </motion.div>
            </div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text glow-text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              id="header-title"
            >
              {t('header.title')}
            </motion.h1>
          </motion.div>
        </div>

        <motion.div
          className="w-40 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-full mb-7 mx-auto shadow-sm"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "10rem", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          id="header-divider"
        />

        <motion.p
          className="mt-3 text-lg sm:text-xl text-gray-700 max-w-2xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          id="header-subtitle"
        >
          {t('header.subtitle')}
        </motion.p>

        <motion.div
          className="mt-4 flex flex-col items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          id="header-powered-by-container"
        >
          <a
            href="https://opentyphoon.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors hover:shadow-md"
            id="header-powered-by-link"
          >
            <span className="mr-1.5">✨</span>
            Powered by Typhoon AI
            <span className="ml-1.5">✨</span>
          </a>

          {showGithubButton && (
            <motion.a
              href="https://github.com/scb-10x/typhoon-chat-with-your-website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors hover:shadow-md"
              id="header-github-link"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FaGithub className="mr-2 text-gray-700" />
              {t('header.github')}
            </motion.a>
          )}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3 items-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          id="header-features-container"
        >
          <span className="flex items-center px-3 py-1.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm" id="header-feature-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature1')}
          </span>
          <span className="flex items-center px-3 py-1.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm" id="header-feature-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature2')}
          </span>
          <span className="flex items-center px-3 py-1.5 bg-white/80 rounded-full shadow-sm backdrop-blur-sm" id="header-feature-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature3')}
          </span>
        </motion.div>

        {/* Add structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Chat With Your Website",
              "description": "Demo showcase of Typhoon AI capabilities - Analyze, summarize, and chat with any website using advanced LLM technology.",
              "applicationCategory": "Artificial Intelligence",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Typhoon AI",
                "url": "https://opentyphoon.ai"
              }
            })
          }}
        />
      </motion.div>
    </header>
  );
};

export default Header; 