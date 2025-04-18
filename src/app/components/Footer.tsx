import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from 'react-icons/si';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 mt-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Disclaimer */}
        <motion.div
          className="w-full max-w-3xl mx-auto mb-6 text-xs text-center text-gray-500 px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {t('header.disclaimer')}
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          {/* Links and Socials */}
          {/* Typhoon Link */}
          <div className="flex gap-8 items-center">
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Built with Typhoon AI
            </a>

            {/* Terms */}
            <a
              href="https://opentyphoon.ai/tac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms and Conditions
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/scb-10x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/9F6nrFXyNt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="w-5 h-5" />
            </a>
            <a
              href="https://huggingface.co/scb10x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Hugging Face"
            >
              <SiHuggingface className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/opentyphoon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="X/Twitter"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* SEO-friendly links and text */}
        <div className="text-xs text-center text-gray-400 mt-4">
          <p>
            This demo showcases the capabilities of{' '}
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-700 transition-colors"
            >
              Typhoon AI
            </a>
            , a state-of-the-art language model that enables powerful conversational AI applications.
          </p>
          <p className="mt-1">
            Explore what you can do with Typhoon AI: website analysis, content summarization, conversational AI, and more.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;