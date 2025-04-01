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

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links and Socials */}
          {/* Typhoon Link */}
          <div className="flex gap-8 items-center">
            <a
              href="https://opentyphoon.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              #BuiltWithTyphoon
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
      </div>
    </footer>
  );
};

export default Footer;