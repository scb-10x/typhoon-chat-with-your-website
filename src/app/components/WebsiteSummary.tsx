import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Language } from './UrlInput';

interface WebsiteSummaryProps {
  url: string;
  title: string;
  summary: string;
  isVisible: boolean;
  isPartial?: boolean;
  language?: Language;
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
      className={`w-full max-w-4xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-lg border ${isPartial ? 'border-yellow-200' : 'border-gray-100'}  `}
    >
      {isPartial && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm /30 ">
          <div className="flex items-start sm:items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Crawling in progress. This is partial data and will update as more pages are crawled.</span>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100   mr-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="animated-underline text-indigo-600 hover:text-purple-700 font-medium text-sm transition-colors  :text-purple-400 break-all"
            >
              {url}
            </a>
          </div>
          <div className="px-2 py-1 bg-indigo-100  rounded-full text-xs font-medium text-indigo-700  self-start sm:self-auto">
            {language === 'th' ? 'ภาษาไทย' : 'English'}
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">
              {language === 'th' ? 'สรุป' : 'Summary'}
            </h3>
            {onReSummarize && (
              <button
                onClick={onReSummarize}
                disabled={isLoading}
                className="flex items-center text-xs text-indigo-600 hover:text-indigo-800  :text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Re-summarize
                  </>
                )}
              </button>
            )}
          </div>
          <div className="text-gray-600  text-sm sm:text-base markdown-content prose prose-indigo  prose-sm sm:prose-base max-w-none overflow-hidden">
            <ReactMarkdown
              components={{
                h1: ({...props}) => <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-gray-800" {...props} />,
                h2: ({...props}) => <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-3 text-gray-800" {...props} />,
                h3: ({...props}) => <h3 className="text-base sm:text-lg font-medium mb-2 mt-3 text-gray-800" {...props} />,
                p: ({...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({...props}) => <li className="mb-1" {...props} />,
                a: ({...props}) => <a className="text-indigo-600 hover:text-indigo-800  :text-indigo-300 animated-underline" {...props} />,
                blockquote: ({...props}) => <blockquote className="border-l-4 border-indigo-200  pl-4 italic my-3 text-gray-700" {...props} />,
                code: ({...props}) => <code className="bg-indigo-50 /30 px-1.5 py-0.5 rounded text-indigo-700  font-mono text-sm" {...props} />,
                pre: ({...props}) => <pre className="bg-gray-50  p-3 rounded-md my-3 overflow-x-auto font-mono text-sm" {...props} />,
                hr: ({...props}) => <hr className="my-4 border-gray-200" {...props} />,
                img: ({...props}) => <img className="rounded-md my-3 max-w-full h-auto shadow-md" {...props} />,
                table: ({...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                th: ({...props}) => <th className="px-3 py-2 bg-gray-50  text-left text-xs font-medium text-gray-700  uppercase tracking-wider" {...props} />,
                td: ({...props}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600  border-b border-gray-100" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Sources section */}
        {sources.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                {language === 'th' ? 'แหล่งที่มา' : 'Sources'}
                <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
                  ({sources.length} {sources.length === 1 ? 'page' : 'pages'})
                </span>
              </h3>
              <button 
                onClick={() => setShowSources(!showSources)}
                className="text-sm text-indigo-600 hover:text-indigo-800  :text-indigo-300 transition-colors flex items-center"
              >
                <span>{showSources ? 'Hide' : 'Show'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {showSources && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 max-h-60 overflow-y-auto rounded-md border border-gray-200"
              >
                <ul className="divide-y divide-gray-200">
                  {sources.map((source, index) => (
                    <li key={index} className="p-2 hover:bg-gray-50 :bg-gray-700/50">
                      <a 
                        href={source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800  :text-indigo-300 break-all flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
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