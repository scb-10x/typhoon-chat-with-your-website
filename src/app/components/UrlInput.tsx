import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import ReportLanguageSelector from './ReportLanguageSelector';

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useI18n();

  const validateUrl = (input: string) => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isRootLevelUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      // Check if the pathname is empty or just '/'
      return !urlObj.pathname || urlObj.pathname === '/';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError(t('urlInput.error.empty'));
      return;
    }

    if (!validateUrl(url)) {
      setError(t('urlInput.error.invalid'));
      return;
    }

    setError('');
    onUrlSubmit(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-8 px-4 sm:px-0"
      id="url-input-container"
    >
      <div className="stripe-card glass-effect bg-white p-5 sm:p-7 mb-6 rounded-xl shadow-lg overflow-visible" id="url-input-card">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center" id="url-input-title">
          <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mr-3 shadow-sm"></span>
          {t('urlInput.title')}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="url-input-form">
          <div className="flex-grow relative">
            <div
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${isFocused
                ? 'ring-2 ring-purple-500 shadow-md'
                : 'border border-gray-200 shadow-sm'
                }`}
              id="url-input-field-container"
            >
              {isFocused && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="flex items-center">
                <div className="pl-4 text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={t('urlInput.placeholder')}
                  className="w-full px-4 py-3.5 bg-transparent focus:outline-none text-sm sm:text-base"
                  disabled={isLoading}
                  id="url-input-field"
                />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-gray-500 flex items-start sm:items-center" id="url-input-help-text">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 sm:mt-0 text-indigo-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                {isRootLevelUrl(url)
                  ? 'สำหรับ URL ระดับบนสุด (เช่น example.com) จะวิเคราะห์ได้สูงสุด 10 หน้า'
                  : 'สำหรับ URL ระดับย่อย (เช่น example.com/page), only the specified page will be analyzed'}
              </span>
            </p>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 text-red-500 text-sm flex items-start sm:items-center"
                id="url-input-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 mt-0.5 sm:mt-0 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center" id="url-input-controls">
            <div className="w-full sm:w-auto relative z-10" id="language-selector-container">
              <ReportLanguageSelector />
            </div>

            <div className="flex-grow flex justify-end sm:justify-end mt-4 sm:mt-0" id="url-submit-container">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading || url.trim() === ''}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                id="url-submit-button"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center" id="url-submit-loading">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('urlInput.processing')}
                  </div>
                ) : (
                  <span className="flex items-center" id="url-submit-text">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {t('urlInput.button')}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UrlInput; 