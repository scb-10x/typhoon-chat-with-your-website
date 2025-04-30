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
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none pl-9 pr-10 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-gray-200/20 text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all duration-200 hover:bg-white/15"
            aria-label={t('language.switch')}
          >
            <option value="en" className="bg-gray-800 text-gray-100">{t('language.en')}</option>
            <option value="th" className="bg-gray-800 text-gray-100">{t('language.th')}</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-300">
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
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher; 