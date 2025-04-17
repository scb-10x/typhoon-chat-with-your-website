import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, LanguageCode } from '../lib/i18n';

const BottomLanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={menuRef}>
      <motion.button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        aria-label={t('language.switch')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        initial={{ scale: 1 }}
        animate={!hasInteracted ? {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 2,
          }
        } : { scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-bold">
          {language.toUpperCase()}
        </span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-0 bg-white  rounded-lg shadow-xl p-2 min-w-40 border border-gray-200"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu-button"
          >
            <div className="p-1 text-sm font-medium text-gray-700  mb-2 border-b border-gray-200">
              {t('language.switch')}
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex items-center px-3 py-2 rounded-md text-left text-sm ${
                  language === 'en'
                    ? 'bg-indigo-100 /30 text-indigo-600 '
                    : 'hover:bg-gray-100 :bg-gray-700 text-gray-700 '
                }`}
                role="menuitem"
                aria-current={language === 'en' ? 'page' : undefined}
              >
                <span className="mr-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200  text-xs font-bold">
                  EN
                </span>
                <span>{t('language.en')}</span>
                {language === 'en' && (
                  <svg className="ml-auto h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('th')}
                className={`flex items-center px-3 py-2 rounded-md text-left text-sm ${
                  language === 'th'
                    ? 'bg-indigo-100 /30 text-indigo-600 '
                    : 'hover:bg-gray-100 :bg-gray-700 text-gray-700 '
                }`}
                role="menuitem"
                aria-current={language === 'th' ? 'page' : undefined}
              >
                <span className="mr-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200  text-xs font-bold">
                  TH
                </span>
                <span>{t('language.th')}</span>
                {language === 'th' && (
                  <svg className="ml-auto h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BottomLanguageSwitcher; 