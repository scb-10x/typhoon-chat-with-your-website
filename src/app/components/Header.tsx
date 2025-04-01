import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '../lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useI18n();

  return (
    <header className="w-full py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <motion.div
              className="w-12 h-12 flex items-center justify-center sm:mr-3 mb-3 sm:mb-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/images/logo.svg"
                alt="Chat With Your Website Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {t('header.title')}
            </motion.h1>
          </motion.div>
        </div>

        <motion.div
          className="w-40 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 mx-auto"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "10rem", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        <motion.p
          className="mt-3 text-lg sm:text-xl text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {t('header.subtitle')}
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-2 items-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature1')}
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature2')}
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('header.feature3')}
          </span>
        </motion.div>

        {/* Add the language switcher in the header */}
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <LanguageSwitcher />
        </div>
      </motion.div>
    </header>
  );
};

export default Header; 