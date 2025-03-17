'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import LanguageProvider from "./components/LanguageProvider";
import { useEffect, useState } from "react";
import { LANGUAGE_CHANGE_EVENT } from "./components/LanguageProvider";
import BottomLanguageSwitcher from "./components/BottomLanguageSwitcher";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default to English, but will be updated from localStorage if available
  const [lang, setLang] = useState('en');

  // Get the language from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLang(savedLanguage);
    }
  }, []);
  
  // Listen for custom language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { language } = event.detail;
      if (language) {
        setLang(language);
      }
    };
    
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
  }, []);

  return (
    <html lang={lang}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <title>Chat With Your Website</title>
        <meta name="description" content="Summarize and chat with any website using AI" />
        <meta property="og:title" content="Chat With Your Website" />
        <meta property="og:description" content="Summarize and chat with any website using AI" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`${inter.className} ${inter.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
      >
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            {children}
            <Footer />
            <BottomLanguageSwitcher />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
