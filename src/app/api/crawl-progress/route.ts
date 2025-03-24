import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { crawlIdMap } from "@/app/lib/scraper";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Get the crawl ID for this URL
  const crawlId = crawlIdMap[url]

  // If we don't have a crawl ID yet, return initializing status
  if (!crawlId) {
    return NextResponse.json({
      progress: "Initializing crawl...",
      completed: 0,
      total: 0,
    });
  }

  try {
    // Get the Firecrawl API key from environment variables
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

    if (!firecrawlApiKey) {
      throw new Error(
        "FIRECRAWL_API_KEY is not defined in environment variables"
      );
    }

    // Fetch the progress directly from Firecrawl API
    const response = await axios.get(
      `${process.env.BASE_FIRECRAWL_URL}/crawl/${crawlId}`,
      {
        headers: {
          Authorization: `Bearer ${firecrawlApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Format the progress message based on the crawl status
    let progressMessage = "Initializing crawl...";

    if (data.status === "scraping") {
      progressMessage = `Crawl in progress: ${data.completed}/${data.total} pages completed`;
    } else if (data.status === "completed") {
      progressMessage = `Crawl completed: ${data.completed} pages crawled`;
    } else if (data.status === "failed") {
      progressMessage = "Crawl failed";
    }

    // Return the progress data
    return NextResponse.json({
      progress: progressMessage,
      crawlId,
      completed: data.completed || 0,
      total: data.total || 0,
      status: data.status,
    });
  } catch (error) {
    console.error("Error fetching crawl progress:", error);

    // Return a generic error message
    return NextResponse.json({
      progress: `Error fetching progress: ${(error as Error).message}`,
      crawlId,
      completed: 0,
      total: 0,
    });
  }
}
