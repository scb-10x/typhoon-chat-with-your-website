import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "../../lib/scraper";
import { summarizeWebsite } from "../../lib/llm";
import { TyphoonModel } from "../../components/ModelSelector";

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

    // Scrape the website
    const scrapedData = await scrapeWebsite(targetUrl);

    // Generate a summary in the specified language using the selected model
    const summary = await summarizeWebsite(scrapedData, language, model as TyphoonModel);

    // Return the scraped data with sources
    return NextResponse.json({
      url: scrapedData.url,
      title: scrapedData.title,
      summary,
      content: scrapedData.content,
      sources: scrapedData.sources || [] // Include sources in the response
    });
  } catch (error) {
    console.error("Error in scrape API:", error);

    // Provide more specific error messages based on the error type
    let errorMessage = `Failed to process website: ${(error as Error).message}`;
    let statusCode = 500;

    if ((error as Error).message.includes("FIRECRAWL_API_KEY")) {
      errorMessage =
        "Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to your environment variables.";
    } else if ((error as Error).message.includes("No content extracted")) {
      errorMessage =
        "Could not extract content from the provided URL. Please try a different website.";
      statusCode = 422;
    } else if ((error as Error).message.includes("429")) {
      errorMessage =
        "Rate limit exceeded for Firecrawl API. Please try again later.";
      statusCode = 429;
    } else if ((error as Error).message.includes("Timed out")) {
      errorMessage =
        "The crawl process timed out. The website might be too large or not responding.";
      statusCode = 408;
    } else if ((error as Error).message.includes("Crawl failed")) {
      errorMessage =
        "The crawl process failed. Please try a different website.";
      statusCode = 422;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// Add a GET method to handle preflight requests
export async function GET() {
  return NextResponse.json({ message: "Scrape API is working" });
}
