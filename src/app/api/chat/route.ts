import { NextRequest, NextResponse } from 'next/server';
import { chatWithWebsite } from '../../lib/llm';
import { ScrapedData } from '../../lib/scraper';
import type { Message } from '../../components/ChatInterface';
import { TyphoonModel } from '../../lib/const';

export async function POST(request: NextRequest) {
  try {
    const { messages, lastMessage, websiteData, language = 'en', model = 'typhoon-v2-70b-instruct' } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!lastMessage) {
      return NextResponse.json(
        { error: 'Last message is required' },
        { status: 400 }
      );
    }

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
    
    // Generate a response using the LLM in the specified language and model with message history
    const response = await chatWithWebsite(
      scrapedData,
      messages as Message[],
      lastMessage,
      language,
      model as TyphoonModel
    );
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: `Failed to process message: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Add a GET method to handle preflight requests
export async function GET() {
  return NextResponse.json({ message: 'Chat API is working' });
} 