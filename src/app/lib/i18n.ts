import { createContext, useContext } from 'react';

// Define all available languages
export type LanguageCode = 'en' | 'th';

// Define translation keys
export type TranslationKey =
  | 'header.title' | 'header.subtitle' | 'header.feature1' | 'header.feature2' | 'header.feature3' | 'header.disclaimer'
  | 'header.github'
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
    'header.title': 'Chat With a Website',
    'header.subtitle': 'Experience Typhoon AI: Enter any website URL, and our AI will summarize and let you interact with its content',
    'header.feature1': 'AI-Powered Crawling',
    'header.feature2': 'Typhoon AI Summaries',
    'header.feature3': 'Interactive LLM Chat',
    'header.disclaimer': 'Disclaimer: This site showcases the capabilities of Typhoon AI. Information and features may contain AI-generated content that might be inaccurate. We are not responsible for generated content. This is a demo of Typhoon\'s use-cases. Visit opentyphoon.ai to learn more about our advanced language models.',
    'header.github': 'Source Code',

    // UrlInput
    'urlInput.title': 'Enter a website to analyze with Typhoon AI',
    'urlInput.placeholder': 'Enter website URL (e.g., https://example.com)',
    'urlInput.info': 'Enter the root URL of the website you want to analyze with Typhoon\'s AI technology',
    'urlInput.error.empty': 'Please enter a website URL',
    'urlInput.error.invalid': 'Please enter a valid URL (including http:// or https://)',
    'urlInput.language': 'Report Language',
    'urlInput.button': 'Analyze with Typhoon AI',
    'urlInput.processing': 'Processing',

    // Language Switcher
    'language.en': 'English',
    'language.th': 'Thai (ภาษาไทย)',
    'language.switch': 'Switch Language',

    // Website Summary
    'summary.title': 'Typhoon AI Website Summary',
    'summary.content': 'Content',
    'summary.loading': 'Analyzing website content with Typhoon AI...',
    'summary.rescan': 'Re-analyze',
  },
  th: {
    // Header
    'header.title': 'แชทกับเว็บไซต์ของคุณ',
    'header.subtitle': 'สัมผัสประสบการณ์ Typhoon AI: ป้อน URL ของเว็บไซต์ และ AI ของเราจะสรุปและให้คุณโต้ตอบกับเนื้อหาได้',
    'header.feature1': 'การเก็บข้อมูลด้วย AI',
    'header.feature2': 'สรุปด้วย Typhoon AI',
    'header.feature3': 'แชทโต้ตอบด้วย LLM',
    'header.disclaimer': 'ข้อสงวนสิทธิ์: เว็บไซต์นี้แสดงความสามารถของ Typhoon AI ข้อมูลและฟีเจอร์อาจมีเนื้อหาที่สร้างโดย AI ซึ่งอาจไม่ถูกต้อง เราไม่รับผิดชอบต่อเนื้อหาที่ถูกสร้างขึ้น นี่คือการสาธิตกรณีการใช้งานของ Typhoon เยี่ยมชม opentyphoon.ai เพื่อเรียนรู้เพิ่มเติมเกี่ยวกับโมเดลภาษาขั้นสูงของเรา',
    'header.github': 'ซอร์สโค้ด',

    // UrlInput
    'urlInput.title': 'ป้อนเว็บไซต์ที่ต้องการวิเคราะห์ด้วย Typhoon AI',
    'urlInput.placeholder': 'ป้อน URL เว็บไซต์ (เช่น https://example.com)',
    'urlInput.info': 'ป้อน URL หลักของเว็บไซต์ที่คุณต้องการวิเคราะห์ด้วยเทคโนโลยี AI ของ Typhoon',
    'urlInput.error.empty': 'กรุณาป้อน URL เว็บไซต์',
    'urlInput.error.invalid': 'กรุณาป้อน URL ที่ถูกต้อง (รวมถึง http:// หรือ https://)',
    'urlInput.language': 'ภาษารายงาน',
    'urlInput.button': 'วิเคราะห์ด้วย Typhoon AI',
    'urlInput.processing': 'กำลังประมวลผล',

    // Language Switcher
    'language.en': 'ภาษาอังกฤษ',
    'language.th': 'ภาษาไทย',
    'language.switch': 'เปลี่ยนภาษา',

    // Website Summary
    'summary.title': 'สรุปเว็บไซต์ด้วย Typhoon AI',
    'summary.content': 'เนื้อหา',
    'summary.loading': 'กำลังวิเคราะห์เนื้อหาเว็บไซต์ด้วย Typhoon AI...',
    'summary.rescan': 'วิเคราะห์ใหม่',
  }
};

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => { },
  t: (key: TranslationKey) => key,
});

export const useI18n = () => useContext(I18nContext);

export const t = (language: LanguageCode, key: TranslationKey): string => {
  return translations[language][key] || key;
}; 