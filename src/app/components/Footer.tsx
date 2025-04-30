import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from 'react-icons/si';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 mt-6 border-t border-gray-200 bg-gradient-to-b from-transparent to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Disclaimer */}
        <motion.div
          className="w-full max-w-3xl mx-auto mb-8 text-xs text-center text-gray-500 px-5 py-3 bg-white/70 rounded-lg shadow-sm backdrop-blur-sm border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {t('header.disclaimer')}
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          {/* Links and Socials */}
          {/* Typhoon Link */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center bg-purple-50 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              #BuiltWithTyphoon
            </a>

            {/* Terms */}
            <a
              href="https://opentyphoon.ai/tac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms and Conditions
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 bg-white/80 px-5 py-3 rounded-full shadow-sm backdrop-blur-sm">
            <a
              href="https://github.com/scb-10x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/9F6nrFXyNt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-700 transition-colors hover:scale-110"
              aria-label="Discord"
            >
              <FaDiscord className="w-5 h-5" />
            </a>
            <a
              href="https://huggingface.co/scb10x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-700 transition-colors hover:scale-110"
              aria-label="Hugging Face"
            >
              <SiHuggingface className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/opentyphoon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black transition-colors hover:scale-110"
              aria-label="X/Twitter"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;