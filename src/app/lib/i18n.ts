import { createContext, useContext } from 'react';

// Define all available languages
export type LanguageCode = 'en' | 'th';

// Define translation keys
export type TranslationKey = 
  | 'header.title' | 'header.subtitle' | 'header.feature1' | 'header.feature2' | 'header.feature3' | 'header.disclaimer'
  | 'urlInput.title' | 'urlInput.placeholder' | 'urlInput.info' | 'urlInput.error.empty' | 'urlInput.error.invalid'
  | 'urlInput.language' | 'urlInput.button' | 'urlInput.processing'
  | 'language.en' | 'language.th' | 'language.switch'
  | 'summary.title' | 'summary.content' | 'summary.loading' | 'summary.rescan';

// Define the type for translations
type TranslationsType = {
  [key in LanguageCode]: {
    [key in TranslationKey]: string;
  }
};

// Define the context for the language
interface I18nContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

export const translations: TranslationsType = {
  en: {
    // Header
    'header.title': 'Chat With the Website',
    'header.subtitle': 'Enter any website URL, and our AI will summarize it and let you chat with its content',
    'header.feature1': 'Automatic Crawling',
    'header.feature2': 'AI-Powered Summaries',
    'header.feature3': 'Interactive Chat',
    'header.disclaimer': 'Disclaimer: This site showcases the capabilities of Typhoon AI. Information and features may contain AI-generated content that might be inaccurate. We are not responsible for generated content. This is a showcase of Typhoon\'s use-cases, which may not be perfect and is not intended to rival proprietary models.',
    
    // UrlInput
    'urlInput.title': 'Enter a website to analyze',
    'urlInput.placeholder': 'Enter website URL (e.g., https://example.com)',
    'urlInput.info': 'Enter the root URL of the website you want to crawl and analyze',
    'urlInput.error.empty': 'Please enter a website URL',
    'urlInput.error.invalid': 'Please enter a valid URL (including http:// or https://)',
    'urlInput.language': 'Report Language',
    'urlInput.button': 'Crawl & Analyze Website',
    'urlInput.processing': 'Processing',
    
    // Language Switcher
    'language.en': 'English',
    'language.th': 'Thai (ภาษาไทย)',
    'language.switch': 'Switch Language',

    // Website Summary
    'summary.title': 'Website Summary',
    'summary.content': 'Content',
    'summary.loading': 'Analyzing website content...',
    'summary.rescan': 'Re-analyze',
  },
  th: {
    // Header
    'header.title': 'แชทกับเว็บไซต์ของคุณ',
    'header.subtitle': 'ป้อน URL ของเว็บไซต์ใด ๆ และ AI ของเราจะสรุปและให้คุณแชทกับเนื้อหาของเว็บไซต์นั้น',
    'header.feature1': 'การเก็บข้อมูลอัตโนมัติ',
    'header.feature2': 'สรุปด้วย AI',
    'header.feature3': 'แชทแบบโต้ตอบ',
    'header.disclaimer': 'ข้อสงวนสิทธิ์: เว็บไซต์นี้แสดงความสามารถของ Typhoon AI ข้อมูลและฟีเจอร์อาจมีเนื้อหาที่สร้างโดย AI ซึ่งอาจไม่ถูกต้อง เราไม่รับผิดชอบต่อเนื้อหาที่ถูกสร้างขึ้น นี่คือการแสดงกรณีการใช้งานของ Typhoon ซึ่งอาจไม่สมบูรณ์แบบและไม่ได้มีวัตถุประสงค์เพื่อแข่งขันกับโมเดลที่เป็นกรรมสิทธิ์',
    
    // UrlInput
    'urlInput.title': 'ป้อนเว็บไซต์ที่ต้องการวิเคราะห์',
    'urlInput.placeholder': 'ป้อน URL เว็บไซต์ (เช่น https://example.com)',
    'urlInput.info': 'ป้อน URL หลักของเว็บไซต์ที่คุณต้องการเก็บข้อมูลและวิเคราะห์',
    'urlInput.error.empty': 'กรุณาป้อน URL เว็บไซต์',
    'urlInput.error.invalid': 'กรุณาป้อน URL ที่ถูกต้อง (รวมถึง http:// หรือ https://)',
    'urlInput.language': 'ภาษารายงาน',
    'urlInput.button': 'เก็บข้อมูลและวิเคราะห์เว็บไซต์',
    'urlInput.processing': 'กำลังประมวลผล',
    
    // Language Switcher
    'language.en': 'ภาษาอังกฤษ',
    'language.th': 'ภาษาไทย',
    'language.switch': 'เปลี่ยนภาษา',

    // Website Summary
    'summary.title': 'สรุปเว็บไซต์',
    'summary.content': 'เนื้อหา',
    'summary.loading': 'กำลังวิเคราะห์เนื้อหาเว็บไซต์...',
    'summary.rescan': 'วิเคราะห์ใหม่',
  }
};

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
});

export const useI18n = () => useContext(I18nContext);

export const t = (language: LanguageCode, key: TranslationKey): string => {
  return translations[language][key] || key;
}; 