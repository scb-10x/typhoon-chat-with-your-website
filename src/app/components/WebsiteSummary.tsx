import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { LanguageCode } from '../lib/i18n';
import Image from 'next/image';

interface WebsiteSummaryProps {
  url: string;
  title: string;
  summary: string;
  isVisible: boolean;
  isPartial?: boolean;
  language?: LanguageCode;
  sources?: string[];
  onReSummarize?: () => void;
  isLoading?: boolean;
}

const WebsiteSummary: React.FC<WebsiteSummaryProps> = ({
  url,
  title,
  summary,
  isVisible,
  isPartial = false,
  language = 'en',
  sources = [],
  onReSummarize,
  isLoading = false
}) => {
  const [showSources, setShowSources] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-4xl mx-auto mt-12 p-5 sm:p-7 glass-effect rounded-xl shadow-lg ${isPartial ? 'border-2 border-yellow-200' : 'border border-gray-200'}`}
      id="website-summary-container"
    >
      {isPartial && (
        <div className="mb-5 p-3 bg-yellow-50/80 border border-yellow-200 rounded-lg text-yellow-800 text-sm backdrop-blur-sm" id="website-summary-partial-notice">
          <div className="flex items-start sm:items-center">
            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Crawling in progress. This is partial data and will update as more pages are crawled.</span>
          </div>
        </div>
      )}
      <div className="flex flex-col" id="website-summary-content">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3" id="website-summary-header">
          <div className="flex items-center" id="website-summary-url-container">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mr-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-underline text-indigo-600 hover:text-purple-700 font-medium text-sm transition-colors break-all flex items-center"
                id="website-summary-url-link"
              >
                <span className="flex items-center"><span>{url}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg></span>
              </a>
              <div className="mt-1 px-2.5 py-1 bg-indigo-100 rounded-full text-xs font-medium text-indigo-700 self-start inline-flex items-center" id="website-summary-language">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></div>
                {language === 'th' ? 'ภาษาไทย' : 'English'}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 mb-4" id="website-summary-title">{title}</h2>

        <div className="mt-2" id="website-summary-content-wrapper">
          <div className="flex justify-between items-center mb-3" id="website-summary-heading">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-2"></div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800" id="website-summary-label">
                {language === 'th' ? 'สรุป' : 'Summary'}
              </h3>
            </div>
            {onReSummarize && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReSummarize}
                disabled={isLoading}
                className="flex items-center text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-poi"
                id="website-resummary-button"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Re-summarize
                  </>
                )}
              </motion.button>
            )}
          </div>
          <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm text-gray-700 text-sm sm:text-base markdown-content prose prose-indigo prose-sm sm:prose-base max-w-none overflow-hidden" id="website-summary-text">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-gray-800" {...props} />,
                h2: ({ ...props }) => <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-3 text-gray-800" {...props} />,
                h3: ({ ...props }) => <h3 className="text-base sm:text-lg font-medium mb-2 mt-3 text-gray-800" {...props} />,
                p: ({ ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({ ...props }) => <li className="mb-1" {...props} />,
                a: ({ ...props }) => <a className="text-indigo-600 hover:text-indigo-800 animated-underline" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic my-3 text-gray-700" {...props} />,
                code: ({ ...props }) => <code className="bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-sm" {...props} />,
                pre: ({ ...props }) => <pre className="bg-gray-50 p-3 rounded-md my-3 overflow-x-auto font-mono text-sm" {...props} />,
                hr: ({ ...props }) => <hr className="my-4 border-gray-200" {...props} />,
                img: ({ src, alt, width, height, ...restProps }) => {
                  if (typeof src === 'string') {
                    // Provide placeholder width/height as Markdown doesn't specify dimensions
                    return <Image className="rounded-md my-3 max-w-full h-auto shadow-md" src={src} alt={alt || 'image from content'} width={parseInt(width?.toString() || '500')} height={parseInt(height?.toString() || '300')} {...restProps} />;
                  }
                  // Optionally render a fallback or null if src is invalid
                  return null;
                },
                table: ({ ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                th: ({ ...props }) => <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" {...props} />,
                td: ({ ...props }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 border-b border-gray-100" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sources section */}
        {sources.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-5" id="website-sources-section">
            <div className="flex items-center justify-between" id="website-sources-header">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-2"></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800" id="website-sources-label">
                  {language === 'th' ? 'แหล่งที่มา' : 'Sources'}
                  <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500" id="website-sources-count">
                    ({sources.length} {sources.length === 1 ? 'page' : 'pages'})
                  </span>
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSources(!showSources)}
                className="text-sm px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center shadow-sm"
                id="website-sources-toggle"
              >
                <span>{showSources ? 'Hide' : 'Show'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1.5 transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>

            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm"
                id="website-sources-list-container"
              >
                <ul className="divide-y divide-gray-200" id="website-sources-list">
                  {sources.map((source, index) => (
                    <li key={index} className="p-3 hover:bg-gray-50 transition-colors" id={`website-source-item-${index}`}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 break-all flex items-center"
                        id={`website-source-link-${index}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </div>
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WebsiteSummary; 