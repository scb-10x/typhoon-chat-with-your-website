# Chat With Your Website

A modern web application that allows users to input a website URL, crawl the entire site, summarize its content using AI, and chat with the crawled website data.

## Features

- **Full Website Crawling**: Crawl entire websites and extract content from multiple pages.
- **Real-time Progress Updates**: Get live updates during the crawling process.
- **Website Analysis**: Get an AI-generated summary of the website content.
- **Interactive Chat**: Ask questions about the website content and get AI-powered responses.
- **Modern UI**: Beautiful and responsive user interface with animations.
- **Real-time Feedback**: Toast notifications for success and error messages.
- **Advanced Web Crawling**: Uses Firecrawl's API for high-quality content extraction from entire websites.

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **Axios**: For HTTP requests
- **Server-Sent Events**: For real-time progress updates
- **Firecrawl API**: For advanced web crawling and content extraction
- **LangChain**: For LLM integration
- **OpenAI**: For AI-powered summarization and chat

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key
- Firecrawl API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-with-your-website.git
   cd chat-with-your-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   MAX_CRAWL_PAGES=10  # Optional: Limit the number of pages to crawl (default: 10)
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter a website URL in the input field (including http:// or https://).
2. Click "Crawl & Analyze Website" to start the crawling process.
3. Watch the real-time progress updates as the website is crawled.
4. Once the website is crawled and analyzed, you can see the summary and start chatting with the website content.
5. Ask questions about the website content in the chat interface.

## How It Works

1. **Website Crawling**: When you enter a URL, Firecrawl API crawls the entire website, following links and extracting content from multiple pages.
2. **Asynchronous Processing**: The crawling process happens asynchronously, with real-time progress updates sent to the UI.
3. **Content Extraction**: The content is extracted in Markdown format for clean, structured data.
4. **AI Summarization**: OpenAI processes the extracted content to generate a comprehensive summary.
5. **Interactive Chat**: You can ask questions about the website, and the AI will respond based on the crawled content.

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add your environment variables (OPENAI_API_KEY, FIRECRAWL_API_KEY, and optionally MAX_CRAWL_PAGES) in the Vercel dashboard.
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [Firecrawl](https://firecrawl.dev/)
- [LangChain](https://js.langchain.com/)
- [Framer Motion](https://www.framer.com/motion/)