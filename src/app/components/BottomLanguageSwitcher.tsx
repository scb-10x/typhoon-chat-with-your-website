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
      <div className="relative">
        {/* Pulsing background effect */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-400/20 blur-md"
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: [0.7, 0.1, 0.7] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          ref={buttonRef}
          onClick={toggleMenu}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="absolute bottom-14 right-0 backdrop-blur-md bg-white/90 rounded-xl shadow-xl p-3 min-w-52 border border-gray-200/50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu-button"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            }}
          >
            <div className="p-1.5 text-sm font-medium text-gray-700 mb-2 border-b border-gray-200/50 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {t('language.switch')}
            </div>
            <div className="flex flex-col space-y-1.5">
              <motion.button
                onClick={() => handleLanguageChange('en')}
                className={`flex items-center px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${language === 'en'
                    ? 'bg-gradient-to-r from-indigo-100/80 to-purple-100/80 text-indigo-600'
                    : 'hover:bg-gray-100/80 text-gray-700'
                  }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                role="menuitem"
                aria-current={language === 'en' ? 'page' : undefined}
              >
                <span className="mr-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 text-xs font-bold text-indigo-600 shadow-sm">
                  EN
                </span>
                <span>{t('language.en')}</span>
                {language === 'en' && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                )}
              </motion.button>
              <motion.button
                onClick={() => handleLanguageChange('th')}
                className={`flex items-center px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${language === 'th'
                    ? 'bg-gradient-to-r from-indigo-100/80 to-purple-100/80 text-indigo-600'
                    : 'hover:bg-gray-100/80 text-gray-700'
                  }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                role="menuitem"
                aria-current={language === 'th' ? 'page' : undefined}
              >
                <span className="mr-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-xs font-bold text-purple-600 shadow-sm">
                  TH
                </span>
                <span>{t('language.th')}</span>
                {language === 'th' && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BottomLanguageSwitcher; 