import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full py-2 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Disclaimer */}
        <motion.div
          className="w-full max-w-3xl mx-auto mb-3 text-xs text-center text-gray-500 dark:text-gray-400 px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {t('header.disclaimer')}
        </motion.div>
        
        {/* Copyright */}
        <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
          <p>© {new Date().getFullYear()} Chat With Your Website. All rights reserved.</p>
          <p className="mt-1 flex items-center justify-center">
            <span>Powered by</span>
            <span className="mx-1 font-medium text-indigo-500">Firecrawl</span>
            <span>and</span>
            <a 
              href="https://opentyphoon.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mx-1 font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Typhoon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;