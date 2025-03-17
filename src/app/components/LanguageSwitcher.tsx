import React from 'react';
import { motion } from 'framer-motion';
import { useI18n, LanguageCode } from '../lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <motion.div
      className="language-switcher flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative text-sm">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="appearance-none pl-3 pr-10 py-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-gray-200/20 text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label={t('language.switch')}
        >
          <option value="en">{t('language.en')}</option>
          <option value="th">{t('language.th')}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher; 