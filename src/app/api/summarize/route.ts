import { NextRequest, NextResponse } from 'next/server';
import { summarizeWebsite } from '../../lib/llm';
import { ScrapedData } from '../../lib/scraper';
import { TyphoonModel } from '../../lib/const';

export async function POST(request: NextRequest) {
  try {
    const { websiteData, language = 'en', model = 'typhoon-v2-70b-instruct' } = await request.json();

    if (!websiteData || !websiteData.url || !websiteData.pages) {
      return NextResponse.json(
        { error: 'Website data is required' },
        { status: 400 }
      );
    }

    // Prepare the scraped data
    const scrapedData: ScrapedData = {
      mainUrl: websiteData.url,
      mainTitle: websiteData.title || 'Untitled Website',
      pages: websiteData.pages,
      totalPages: websiteData.totalPages || websiteData.pages.length
    };
    
    // Generate a summary using the LLM in the specified language and model
    const summary = await summarizeWebsite(scrapedData, language, model as TyphoonModel);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: `Failed to summarize website: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Add a GET method to handle preflight requests
export async function GET() {
  return NextResponse.json({ message: 'Summarize API is working' });
} 