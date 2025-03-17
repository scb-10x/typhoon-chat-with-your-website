'use client';

import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import UrlInput, { Language } from './components/UrlInput';
import WebsiteSummary from './components/WebsiteSummary';
import ChatInterface from './components/ChatInterface';
import type { Message } from './components/ChatInterface';
import ProgressBar from './components/ProgressBar';
import BackgroundDecoration from './components/BackgroundDecoration';
import ModelSelector, { TyphoonModel } from './components/ModelSelector';
import { AnimatePresence } from 'framer-motion';

interface WebsiteData {
  url: string;
  title: string;
  summary: string;
  content: string;
  notice?: string;
  sources?: string[];
}

interface PartialWebsiteData {
  url: string;
  title: string;
  content: string;
  completed: number;
  total: number;
  sources?: string[];
  summary?: string;
}

interface CrawlProgress {
  progress: string;
  crawlId?: string;
  completed: number;
  total: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [partialData, setPartialData] = useState<PartialWebsiteData | null>(null);
  const [isCrawlComplete, setIsCrawlComplete] = useState(false);
  const [crawlId, setCrawlId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedModel, setSelectedModel] = useState<TyphoonModel>('typhoon-v2-70b-instruct');
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
      document.title = `${websiteData.title} | Chat With Your Website`;
    } else if (partialData) {
      document.title = `Analyzing ${partialData.title} | Chat With Your Website`;
    } else {
      document.title = "Chat With Your Website";
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
          
          // Update progress to 100%
          updateProgress('Generating summary...', data.total, data.total);
          
          // Hide progress bar after a delay
          setTimeout(() => {
            setShowProgress(false);
          }, 2000);
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
        
        // Update progress to indicate completion
        updateProgress(`Crawl completed: ${data.completed} pages crawled. Generating summary...`, data.completed, data.total);
        
        // Hide progress bar after a delay
        setTimeout(() => {
          setShowProgress(false);
        }, 2000);
        
        return;
      }
      
      if (data.content && data.title) {
        setPartialData({
          url,
          title: data.title,
          content: data.content,
          completed: data.completed,
          total: data.total,
          sources: data.sources || [],
          summary: data.summary
        });
        
        // Update progress bar with the latest data
        updateProgress('Crawling website...', data.completed, data.total);
      }
    } catch (error) {
      console.error('Error polling for content:', error);
    }
  };

  const handleUrlSubmit = async (urlInput: string, selectedLanguage: Language) => {
    setIsLoading(true);
    setWebsiteData(null);
    setPartialData(null);
    setIsCrawlComplete(false);
    setCrawlId(null);
    setLanguage(selectedLanguage);
    
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
      const isSingleUrl = urls.length === 1;
      
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
          url: isSingleUrl ? urls[0] : null,
          urls: !isSingleUrl ? urls : null,
          language: selectedLanguage,
          model: selectedModel
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
      
      // Hide progress bar
      setShowProgress(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze website');
      }

      const data = await response.json();
      setWebsiteData({
        url: data.url,
        title: data.title,
        summary: data.summary,
        content: data.content,
        sources: data.sources || [],
        notice: data.notice
      });
      setPartialData(null); // Clear partial data once we have the full data
      
      // Show success message
      toast.success('Website crawled and analyzed successfully!');
      
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
      
      // Hide progress bar
      setShowProgress(false);
      
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
    }
  };

  const handleSendMessage = async (messages: Message[]): Promise<string> => {
    // If we have partial data and the crawl is not complete, inform the user
    if (partialData && !isCrawlComplete && !websiteData) {
      return "I'm still crawling the website. My answers are based on partial data and may be incomplete. Please wait for the full crawl to complete for more accurate responses.";
    }
    
    // Use either the complete website data or the partial data
    const dataToUse = websiteData || (partialData ? {
      url: partialData.url,
      title: partialData.title,
      content: partialData.content
    } : null);
    
    if (!dataToUse) {
      return 'Please analyze a website first.';
    }
    
    // Get the last user message from the messages array
    const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    
    if (!lastUserMessage) {
      return 'No message to process.';
    }
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          lastMessage: lastUserMessage.content,
          websiteData: {
            url: dataToUse.url,
            title: dataToUse.title,
            content: dataToUse.content,
          },
          language: language,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process message');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return `Error: ${(error as Error).message}`;
    }
  };

  // Function to re-summarize the website content without re-crawling
  const handleReSummarize = async () => {
    if (!websiteData && !partialData) {
      toast.error('No website data available to re-summarize');
      return;
    }

    // Use either the complete website data or the partial data
    const dataToUse = websiteData || partialData;
    if (!dataToUse) return;

    setIsLoading(true);
    
    try {
      // Show progress bar with initial state
      updateProgress('Re-summarizing website content...');
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteData: {
            url: dataToUse.url,
            title: dataToUse.title,
            content: dataToUse.content,
          },
          language: language,
          model: selectedModel
        }),
      });

      // Hide progress bar
      setShowProgress(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to re-summarize website');
      }

      const data = await response.json();
      
      // Update the website data with the new summary
      if (websiteData) {
        setWebsiteData({
          ...websiteData,
          summary: data.summary
        });
      } else if (partialData) {
        // If we only have partial data, update that
        setPartialData({
          ...partialData,
          // Add the summary property to the partial data
          completed: partialData.completed,
          total: partialData.total,
          url: partialData.url,
          title: partialData.title,
          content: partialData.content,
          sources: partialData.sources,
          summary: data.summary
        });
      }
      
      // Show success message
      toast.success('Website content re-summarized successfully!');
    } catch (error) {
      console.error('Error re-summarizing website:', error);
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative flex-grow">
      <BackgroundDecoration />
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        
        <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
        
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />
        
        <div className="mt-4">
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
            language={language}
            sources={websiteData?.sources || partialData?.sources || []}
            onReSummarize={handleReSummarize}
            isLoading={isLoading}
          />
        )}
        
        {/* Enable chat with either complete or partial data */}
        {(websiteData || partialData) && (
          <ChatInterface
            url={websiteData?.url || partialData?.url || ''}
            isVisible={true}
            onSendMessage={handleSendMessage}
            isPartialData={!websiteData && !!partialData}
            language={language}
            model={selectedModel}
          />
        )}
        
      </div>
    </div>
  );
}
