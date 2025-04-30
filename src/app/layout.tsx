'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import LanguageProvider from "./components/LanguageProvider";
import { useEffect, useState } from "react";
import { LANGUAGE_CHANGE_EVENT } from "./components/LanguageProvider";
import BottomLanguageSwitcher from "./components/BottomLanguageSwitcher";
import Footer from "./components/Footer";
import Script from "next/script";

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
        <title>Chat With Your Website | Powered by Typhoon AI</title>
        <meta name="description" content="Demo showcase of Typhoon AI capabilities - Analyze, summarize, and chat with any website using advanced LLM technology from Typhoon." />
        <meta name="keywords" content="Typhoon AI, LLM, website analysis, AI chat, OpenTyphoon, NLP, chatbot, website summarizer" />
        <meta property="og:title" content="Chat With Your Website | Powered by Typhoon AI" />
        <meta property="og:description" content="Demo showcase of Typhoon AI capabilities - Analyze, summarize, and chat with any website using advanced LLM technology from Typhoon." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Typhoon AI Demo" />
        <meta property="og:url" content="https://opentyphoon.ai" />
        <meta property="og:image" content="/images/og.jpg" />
        <meta property="og:logo" content="/images/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chat With Your Website | Powered by Typhoon AI" />
        <meta name="twitter:description" content="Demo showcase of Typhoon AI capabilities - Analyze, summarize, and chat with any website using advanced LLM technology." />
        <meta name="twitter:image" content="/images/og.jpg" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://opentyphoon.ai" />
        <Script id="gtm-script">
          {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WK925XWL');
    `}
        </Script>

      </head>
      <body
        className={`${inter.className} ${inter.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden`}
      ><noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WK925XWL"
            height={0} width={0} style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>


        <LanguageProvider>
          <div className="flex flex-col min-h-screen relative">
            {children}
            <Footer />
            <BottomLanguageSwitcher />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
