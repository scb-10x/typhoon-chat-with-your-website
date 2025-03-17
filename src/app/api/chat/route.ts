import { NextRequest, NextResponse } from 'next/server';
import { chatWithWebsite } from '../../lib/llm';
import { ScrapedData } from '../../lib/scraper';
import { TyphoonModel } from '../../components/ModelSelector';
import type { Message } from '../../components/ChatInterface';

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

    if (!websiteData || !websiteData.url || !websiteData.content) {
      return NextResponse.json(
        { error: 'Website data is required' },
        { status: 400 }
      );
    }

    // In a production app, you would retrieve the website data from a database or session
    // based on a session ID or website ID rather than passing it in the request
    
    const scrapedData: ScrapedData = {
      url: websiteData.url,
      title: websiteData.title || 'Untitled Page',
      content: websiteData.content,
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