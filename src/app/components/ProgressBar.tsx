import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  isVisible: boolean;
  progress: number; // 0-100
  total: number;
  completed: number;
  status: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  isVisible,
  progress,
  total,
  completed,
  status,
}) => {
  if (!isVisible) return null;

  // Convert progress to a safe value between 0-100
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  // Determine the current phase based on the status text
  const isSummarizing = status.toLowerCase().includes('summary') || status.toLowerCase().includes('preparing');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-3xl mx-auto -mt-4 mb-8 px-4 sm:px-0"
    >
      <div className="rounded-lg overflow-hidden bg-white/90 backdrop-blur-md shadow-md /90 border border-gray-200">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                  isSummarizing 
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500" 
                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                }`}
              />
              <h3 className="text-xs sm:text-sm font-medium text-gray-700  line-clamp-1">
                {status}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-0">
              <div className="px-2 py-0.5 sm:py-1 bg-indigo-100  rounded-full text-xs font-medium text-indigo-700">
                <span className="font-bold">{completed}</span>
                <span className="mx-1">/</span>
                <span>{total}</span>
                <span className="ml-1">pages</span>
              </div>
              <div className="px-2 py-0.5 sm:py-1 bg-purple-100  rounded-full text-xs font-medium text-purple-700">
                <span className="font-bold">{safeProgress}%</span>
                <span className="ml-1">complete</span>
              </div>
            </div>
          </div>
          
          <div className="h-2 sm:h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            {isSummarizing ? (
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 animate-progress-infinite"
              />
            ) : (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${safeProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                style={{
                  backgroundSize: '200% 200%',
                  backgroundPosition: `${100 - safeProgress}% 50%`,
                }}
              />
            )}
          </div>
          
          <div className="flex flex-col xs:flex-row justify-between mt-2 text-xs">
            <span className="text-gray-500">
              {isSummarizing ? 'Summarizing content' : 'Crawling website'}
            </span>
            <span className="font-medium text-gray-700  mt-1 xs:mt-0">
              {isSummarizing ? 'Preparing AI summary...' : `${completed} pages crawled`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressBar; 