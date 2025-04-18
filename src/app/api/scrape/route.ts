import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "../../lib/scraper";
import { summarizeWebsite } from "../../lib/llm";
import { TyphoonModel } from "../../lib/const";

const isRootLevelUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return !urlObj.pathname || urlObj.pathname === '/';
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { url, language = 'en', model = 'typhoon-v2-70b-instruct' } = await request.json();

    const targetUrl = url;

    if (!targetUrl) {
      return NextResponse.json(
        { error: "URL is required. Please provide a website URL to crawl." },
        { status: 400 }
      );
    }

    // Check if Firecrawl API key is configured
    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Set page limit based on URL type
    const pageLimit = isRootLevelUrl(targetUrl) ? 10 : 1;

    // Scrape the website with the appropriate page limit
    const scrapedData = await scrapeWebsite(targetUrl, pageLimit);

    // Generate a summary in the specified language using the selected model
    const summary = await summarizeWebsite(scrapedData, language, model as TyphoonModel);

    // Return the scraped data with sources
    return NextResponse.json({
      url: scrapedData.mainUrl,
      title: scrapedData.mainTitle,
      summary,
      pages: scrapedData.pages,
      totalPages: scrapedData.totalPages
    });
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: `Failed to scrape website: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Add a GET method to handle preflight requests
export async function GET() {
  return NextResponse.json({ message: "Scrape API is working" });
}
