'use client';

import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import WebsiteSummary from './components/WebsiteSummary';
import ChatInterface from './components/ChatInterface';
import type { Message } from './components/ChatInterface';
import ProgressBar from './components/ProgressBar';
import BackgroundDecoration from './components/BackgroundDecoration';
import ModelSelector from './components/ModelSelector';
import { AnimatePresence } from 'framer-motion';
import { TyphoonModel } from './lib/const';
import { useI18n } from './lib/i18n';

interface WebsiteData {
  url: string;
  title: string;
  summary: string;
  pages: {
    url: string;
    title: string;
    content: string;
    description?: string;
  }[];
  totalPages: number;
}

interface PartialWebsiteData {
  url: string;
  title: string;
  pages: {
    url: string;
    title: string;
    content: string;
    description?: string;
  }[];
  completed: number;
  total: number;
  totalPages: number;
  summary?: string;
}

interface CrawlProgress {
  progress: string;
  crawlId?: string;
  completed: number;
  total: number;
}

export default function Home() {
  const { language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [partialData, setPartialData] = useState<PartialWebsiteData | null>(null);
  const [isCrawlComplete, setIsCrawlComplete] = useState(false);
  const [crawlId, setCrawlId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<TyphoonModel>('typhoon-v2.1-12b-instruct');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Progress state
  const [showProgress, setShowProgress] = useState(false);
  const [progressStatus, setProgressStatus] = useState('Initializing crawl...');
  const [progressValue, setProgressValue] = useState(0);
  const [progressTotal, setProgressTotal] = useState(1);
  const [progressCompleted, setProgressCompleted] = useState(0);

  // Update document title when website data changes
  useEffect(() => {
    if (websiteData) {
      document.title = `${websiteData.title} | Chat With Your Website - Powered by Typhoon AI`;
    } else if (partialData) {
      document.title = `Analyzing ${partialData.title} | Chat With Your Website - Typhoon AI Demo`;
    } else {
      document.title = "Chat With Your Website | Powered by Typhoon AI - Demo Showcase";
    }
  }, [websiteData, partialData]);

  // Cleanup function for intervals
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (progressPollingIntervalRef.current) {
        clearInterval(progressPollingIntervalRef.current);
      }
    };
  }, []);

  // Function to update progress display
  const updateProgress = (status: string, completed: number = 0, total: number = 1) => {
    setProgressStatus(status);
    setProgressCompleted(completed);
    setProgressTotal(total);

    // Calculate percentage (0-100)
    const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
    setProgressValue(percentage);

    // Show progress bar if not already shown
    if (!showProgress) {
      setShowProgress(true);
    }
  };

  // Function to poll for crawl progress
  const pollForProgress = async (url: string) => {
    try {
      const response = await fetch(`/api/crawl-progress?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        return;
      }

      const data: CrawlProgress = await response.json();

      if (data.progress) {
        // Update the progress bar using the direct values from the API
        updateProgress(
          `Crawling website: ${data.progress}`,
          data.completed,
          data.total
        );

        // If we get a crawl ID from the progress updates, start polling for partial content
        if (data.crawlId && !crawlId) {
          setCrawlId(data.crawlId);

          // Start polling for partial content every 5 seconds
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          pollingIntervalRef.current = setInterval(() => {
            // Only poll if the crawl is not complete and we have a valid crawl ID
            if (!isCrawlComplete && data.crawlId) {
              pollForContent(url, data.crawlId);
            } else if (pollingIntervalRef.current) {
              // If the crawl is complete, stop polling
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }, 5000);
        }

        // If the progress message indicates completion, set isCrawlComplete
        if (data.progress.includes('Crawl completed') || data.progress.includes('generating summary')) {
          setIsCrawlComplete(true);
          // Stop polling when the crawl is complete
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          if (progressPollingIntervalRef.current) {
            clearInterval(progressPollingIntervalRef.current);
            progressPollingIntervalRef.current = null;
          }

          // Update progress to 100% and indicate summary generation
          updateProgress('Generating summary...', data.total, data.total);
        }
      }
    } catch (error) {
      console.error('Error polling for progress:', error);
    }
  };

  // Function to poll for partial content
  const pollForContent = async (url: string, id: string) => {
    try {
      const response = await fetch(`/api/partial-content?crawlId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch partial content');
      }

      const data = await response.json();

      // If the crawl is completed, stop polling and update state
      if (data.status === 'completed') {
        setIsCrawlComplete(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (progressPollingIntervalRef.current) {
          clearInterval(progressPollingIntervalRef.current);
          progressPollingIntervalRef.current = null;
        }

        // Update progress to indicate completion and summary generation
        updateProgress(`Crawl completed: ${data.completed} pages crawled. Generating summary...`, data.completed, data.total);

        return;
      }

      if (data.pages && data.title) {
        setPartialData({
          url,
          title: data.title,
          pages: data.pages,
          completed: data.completed,
          total: data.total,
          totalPages: data.totalPages,
          summary: data.summary
        });

        // Update progress bar with the latest data
        updateProgress('Crawling website...', data.completed, data.total);
      }
    } catch (error) {
      console.error('Error polling for content:', error);
    }
  };

  const handleUrlSubmit = async (urlInput: string) => {
    setIsLoading(true);
    setWebsiteData(null);
    setPartialData(null);
    setIsCrawlComplete(false);
    setCrawlId(null);

    // Clean up any existing intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (progressPollingIntervalRef.current) {
      clearInterval(progressPollingIntervalRef.current);
      progressPollingIntervalRef.current = null;
    }

    try {
      // Process the input to handle multiple URLs
      const urls = urlInput.split(',').map(url => url.trim()).filter(url => url.length > 0);

      // Show progress bar with initial state
      updateProgress(`Initiating crawl for ${urls[0]}...`);

      // Start polling for progress updates every 2 seconds
      progressPollingIntervalRef.current = setInterval(() => {
        pollForProgress(urls[0]);
      }, 2000);

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urls[0],
          model: selectedModel,
          language: language
        }),
      });

      // Clear the polling intervals
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (progressPollingIntervalRef.current) {
        clearInterval(progressPollingIntervalRef.current);
        progressPollingIntervalRef.current = null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze website');
      }

      const data = await response.json();

      // Update the website data with the new structure
      setWebsiteData({
        url: data.url,
        title: data.title,
        summary: data.summary,
        pages: data.pages,
        totalPages: data.totalPages
      });
      setPartialData(null); // Clear partial data once we have the full data

      // Show success message
      toast.success('Website analyzed successfully!');

      // If there's a notice, show it as an informational toast
      if (data.notice) {
        setTimeout(() => {
          toast(data.notice, {
            icon: 'ℹ️',
            duration: 5000,
            style: {
              borderRadius: '10px',
              background: '#3498db',
              color: '#fff',
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error analyzing website:', error);

      let errorMessage = `Error: ${(error as Error).message}`;

      if ((error as Error).message.includes('Firecrawl API key')) {
        errorMessage = 'Error: The Firecrawl API key is not configured. Please contact the administrator.';
      } else if ((error as Error).message.includes('No content extracted')) {
        errorMessage = 'Error: Could not extract content from this website. Please try a different URL.';
      } else if ((error as Error).message.includes('Rate limit')) {
        errorMessage = 'Error: Rate limit exceeded. Please try again later.';
      } else if ((error as Error).message.includes('Timed out')) {
        errorMessage = 'Error: The crawl process timed out. The website might be too large or not responding.';
      } else if ((error as Error).message.includes('Crawl failed')) {
        errorMessage = 'Error: The crawl process failed. Please try a different website.';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Hide progress bar when everything is done (success or fail)
      setShowProgress(false);
    }
  };

  const handleSendMessage = async (messages: Message[]): Promise<string> => {
    if (!websiteData && !partialData) {
      return 'Please analyze a website first.';
    }

    try {
      const data = websiteData || partialData;
      if (!data) return 'No website data available.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          lastMessage: messages[messages.length - 1].content,
          websiteData: {
            url: data.url,
            title: data.title,
            pages: data.pages,
            totalPages: data.totalPages || data.pages.length
          },
          model: selectedModel,
          language: language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process message');
      }

      const { response: aiResponse } = await response.json();
      return aiResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Function to re-summarize the website content without re-crawling
  const handleReSummarize = async () => {
    if (!websiteData && !partialData) {
      toast.error('No website data available to summarize.');
      return;
    }

    try {
      const data = websiteData || partialData;
      if (!data) return;
      setIsLoading(true)

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteData: {
            url: data.url,
            title: data.title,
            pages: data.pages,
            totalPages: data.totalPages || data.pages.length
          },
          model: selectedModel,
          language: language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const { summary } = await response.json();

      // Update the website data with the new summary
      if (websiteData) {
        setWebsiteData({
          ...websiteData,
          summary
        });
      } else if (partialData) {
        setPartialData({
          ...partialData,
          summary
        });
      }
      setIsLoading(false)

      toast.success('Summary regenerated successfully!');
    } catch (error) {
      console.error('Error regenerating summary:', error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white relative flex-grow">
      <BackgroundDecoration />
      <Toaster position="top-center" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <UrlInput onUrlSubmit={handleUrlSubmit} isLoading={isLoading} />

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />

        <div className="pt-4">
          <AnimatePresence>
            {showProgress && (
              <ProgressBar
                isVisible={showProgress}
                progress={progressValue}
                total={progressTotal}
                completed={progressCompleted}
                status={progressStatus}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Show either the complete website data or partial data */}
        {(websiteData || partialData) && (
          <WebsiteSummary
            url={websiteData?.url || partialData?.url || ''}
            title={websiteData?.title || partialData?.title || ''}
            summary={websiteData?.summary || (partialData ? `Crawling in progress: ${partialData.completed}/${partialData.total} pages crawled` : '')}
            isVisible={!!(websiteData || partialData)}
            isPartial={!websiteData && !!partialData}
            isLoading={isLoading}
            sources={websiteData?.pages.map(page => page.url) || partialData?.pages.map(page => page.url) || []}
            onReSummarize={handleReSummarize}
          />
        )}

        {/* Enable chat with either complete or partial data */}
        {(websiteData || partialData) && (
          <ChatInterface
            url={websiteData?.url || partialData?.url || ''}
            isVisible={true}
            onSendMessage={handleSendMessage}
            isPartialData={!websiteData && !!partialData}
            model={selectedModel}
          />
        )}

      </div>
    </div>
  );
}
