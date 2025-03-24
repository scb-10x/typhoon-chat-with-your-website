import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define interfaces for Firecrawl API responses
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

interface FirecrawlResultResponse {
  status: string; // "scraping" or "completed"
  total: number;
  completed: number;
  creditsUsed: number;
  expiresAt: string;
  next?: string;
  data: FirecrawlPage[];
}

// This API route is used to fetch partial content during the crawling process
export async function GET(request: NextRequest) {
  try {
    const crawlId = request.nextUrl.searchParams.get('crawlId');
    
    if (!crawlId) {
      return NextResponse.json(
        { error: 'crawlId parameter is required' },
        { status: 400 }
      );
    }

    // Get the Firecrawl API key from environment variables
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      return NextResponse.json(
        { error: 'FIRECRAWL_API_KEY is not defined in environment variables' },
        { status: 500 }
      );
    }

    // Fetch the current state of the crawl
    const response = await axios.get<FirecrawlResultResponse>(
      `${process.env.BASE_FIRECRAWL_URL}/crawl/${crawlId}`,
      {
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const resultData = response.data;
    
    // Process the data to return partial content
    let combinedContent = '';
    let mainTitle = 'Untitled Website';
    const sources: string[] = []; // Array to store source URLs
    
    // Process each page that has been crawled so far
    if (resultData.data && resultData.data.length > 0) {
      resultData.data.forEach((page: FirecrawlPage, index: number) => {
        // Use the first page's title as the main title
        if (index === 0 && page.metadata && page.metadata.title) {
          mainTitle = page.metadata.title;
        }
        
        // Add source URL to the sources array if it exists
        if (page.metadata && page.metadata.sourceURL) {
          sources.push(page.metadata.sourceURL);
        }
        
        // Add a separator between different pages
        if (index > 0) {
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
      
      // Add information about crawl progress
      combinedContent += `\n\n--- Crawl Progress ---\n`;
      combinedContent += `Pages crawled so far: ${resultData.completed} of ${resultData.total}\n`;
      
      if (resultData.status === 'scraping') {
        combinedContent += `Status: Crawl in progress...\n`;
      } else if (resultData.status === 'completed') {
        combinedContent += `Status: Crawl completed\n`;
      }
    }

    // Return the partial content
    return NextResponse.json({
      title: mainTitle,
      content: combinedContent,
      status: resultData.status,
      completed: resultData.completed,
      total: resultData.total,
      sources: sources // Include the sources in the response
    });
  } catch (error) {
    console.error('Error fetching partial content:', error);
    return NextResponse.json(
      { error: `Failed to fetch partial content: ${(error as Error).message}` },
      { status: 500 }
    );
  }
} 