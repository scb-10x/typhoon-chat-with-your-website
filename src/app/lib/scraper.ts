import axios from 'axios';

export const crawlIdMap: Record<string, string> = {};

export interface PageData {
  url: string;
  title: string;
  content: string;
  description?: string;
}

export interface ScrapedData {
  pages: PageData[];
  mainUrl: string;
  mainTitle: string;
  totalPages: number;
}

interface FirecrawlMetadata {
  title: string;
  language: string;
  sourceURL: string;
  description: string;
  ogLocaleAlternate: string[];
  statusCode: number;
}

interface FirecrawlPage {
  markdown: string;
  html: string;
  metadata: FirecrawlMetadata;
}

interface FirecrawlInitResponse {
  success: boolean;
  id: string;
  url: string;
}

interface FirecrawlResultResponse {
  status: string; // "scraping" or "completed"
  total: number;
  completed: number;
  creditsUsed: number;
  expiresAt: string;
  next?: string;
  data: FirecrawlPage[];
}

/**
 * Scrapes a website using Firecrawl's API and extracts its content
 * @param url The URL of the website to scrape
 * @param pageLimit The maximum number of pages to crawl
 * @returns The scraped data including title, content, and sources
 */
export async function scrapeWebsite(url: string, pageLimit: number = 10): Promise<ScrapedData> {
  try {
    // Get the Firecrawl API key from environment variables
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY is not defined in environment variables');
    }

    console.log(`Crawl page limit set to: ${pageLimit} pages`);

    // Step 1: Initiate the crawl
    console.log(`Initiating crawl for ${url}...`);
    const initResponse = await axios.post<FirecrawlInitResponse>(
      `${process.env.BASE_FIRECRAWL_URL}/crawl`,
      {
        url: url,
        limit: pageLimit,
        scrapeOptions: {
          formats: ["markdown"]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if the crawl was initiated successfully
    if (!initResponse.data.success || !initResponse.data.id) {
      throw new Error('Failed to initiate crawl');
    }

    const crawlId = initResponse.data.id;
    console.log(`Crawl initiated with ID: ${crawlId}`);
    
    // Store the crawl ID for progress tracking
    crawlIdMap[url] = crawlId

    // Step 2: Poll for results and continuously update content
    let resultResponse: FirecrawlResultResponse | null = null;
    let attempts = 0;
    const maxAttempts = 30;
    const pollingInterval = 3000; // 3 seconds between polls
    
    // Keep track of processed pages to avoid duplicates
    const processedPageUrls = new Set<string>();
    const sources: string[] = []; // Array to store source URLs
    let combinedContent = '';
    let mainTitle = 'Untitled Website';
    let lastCompletedCount = 0;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Polling for results (attempt ${attempts}/${maxAttempts})...`);
      
      try {
        const response = await axios.get<FirecrawlResultResponse>(
          `${process.env.BASE_FIRECRAWL_URL}/crawl/${crawlId}`,
          {
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        resultResponse = response.data;
        
        // Process any new pages that have been crawled
        if (resultResponse.data && resultResponse.data.length > 0) {
          // Process new pages and update the combined content
          resultResponse.data.forEach((page) => {
            // Skip if we've already processed this page
            if (page.metadata && page.metadata.sourceURL && processedPageUrls.has(page.metadata.sourceURL)) {
              return;
            }
            
            // Add this page URL to the processed set
            if (page.metadata && page.metadata.sourceURL) {
              processedPageUrls.add(page.metadata.sourceURL);
              sources.push(page.metadata.sourceURL); // Add to sources array
            }
            
            // Use the first page's title as the main title if not set yet
            if (mainTitle === 'Untitled Website' && page.metadata && page.metadata.title) {
              mainTitle = page.metadata.title;
            }
            
            // Add a separator between different pages
            if (combinedContent.length > 0) {
              combinedContent += '\n\n--- Content from ' + (page.metadata?.sourceURL || 'unknown URL') + ' ---\n\n';
            } else {
              // For the first page, add a header
              combinedContent += `# ${mainTitle}\n\n`;
              if (page.metadata && page.metadata.description) {
                combinedContent += `${page.metadata.description}\n\n`;
              }
            }
            
            // Add the content (prefer markdown as it's cleaner)
            combinedContent += page.markdown || '';
          });
          
          // Update progress with the number of new pages
          if (resultResponse.completed > lastCompletedCount) {
            lastCompletedCount = resultResponse.completed;
            const progressMessage = `Crawl progress: ${resultResponse.completed}/${resultResponse.total} pages completed`;
            console.log(progressMessage);
          }
        }
        
        // If the crawl is completed, we can break out of the loop
        if (resultResponse.status === 'completed') {
          console.log(`Crawl completed with status: ${resultResponse.status}`);
          break;
        }
        
        // If the crawl is still in progress (status is "scraping"), wait before polling again
        if (resultResponse.status === 'scraping') {
          const progressMessage = `Crawl in progress: ${resultResponse.completed}/${resultResponse.total} pages completed`;
          console.log(progressMessage);
          await new Promise(resolve => setTimeout(resolve, pollingInterval));
          continue;
        }
        
        // If the crawl failed, throw an error
        if (resultResponse.status === 'failed') {
          throw new Error('Crawl failed');
        }
        
        // For any other status, wait and try again
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      } catch (error) {
        console.error('Error polling for results:', error);
        // If we get an error while polling, wait and try again
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      }
    }

    // If we've exhausted all polling attempts without getting results
    if (!resultResponse) {
      throw new Error('Timed out waiting for crawl results');
    }

    // Check if we have results
    if (processedPageUrls.size === 0) {
      throw new Error('No content extracted from the URL');
    }

    console.log(`Firecrawl crawled ${resultResponse.completed} pages from ${url}`);
    
    // Add information about crawl statistics
    combinedContent += `\n\n--- Crawl Statistics ---\n`;
    combinedContent += `Total pages crawled: ${resultResponse.completed} of ${resultResponse.total}\n`;
    
    // If there's a next page, mention it
    if (resultResponse.next) {
      combinedContent += `\nNote: There are more pages available that weren't included in this crawl.\n`;
    }

    // Return the scraped data
    return {
      pages: resultResponse.data.map((page) => ({
        url: page.metadata.sourceURL,
        title: page.metadata.title,
        content: page.markdown || '',
        description: page.metadata.description
      })),
      mainUrl: url,
      mainTitle: mainTitle,
      totalPages: resultResponse.total
    };
  } catch (error) {
    console.error('Error scraping website with Firecrawl:', error);
    throw new Error(`Failed to scrape website: ${(error as Error).message}`);
  }
} 