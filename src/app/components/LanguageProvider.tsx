import React, { useState, useEffect, ReactNode } from 'react';
import { I18nContext, LanguageCode, TranslationKey, t } from '../lib/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

// Custom event for language changes
export const LANGUAGE_CHANGE_EVENT = 'language-change';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage and dispatch event
  const handleSetLanguage = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { language: newLanguage } });
    window.dispatchEvent(event);
  };

  // Translation function
  const translate = (key: TranslationKey): string => {
    return t(language, key);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translate,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default LanguageProvider; 