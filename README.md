# Typhoon Chat With Your Website

## Introduction

[Typhoon Chat With Your Website](https://chat.apps.opentyphoon.ai) is a web application that allows users to have interactive conversations with any website's content. By simply entering a URL, the application crawls the site, processes its content, and enables natural language interactions with the information contained within the website.

This project is part of [Typhoon Application Week](https://apps.opentyphoon.ai), showcasing the capabilities of the [Typhoon platform](https://opentyphoon.ai). Please note that this application is not maintained for production use and is not production-ready. Use at your own risk.

## Highlighted Features + Typhoon Integration

- **Website Content Understanding**: Typhoon processes crawled website content to build a comprehensive understanding of the site's information, enabling it to answer questions accurately.

- **Interactive Q&A**: Users can ask questions in natural language about the website's content, with Typhoon generating contextually relevant responses based on the processed information.

- **AI-Powered Website Summarization**: Typhoon's summarization capabilities analyze the entire website to generate a concise overview of the main topics and content areas.

- **Context-Aware Responses**: Typhoon maintains context throughout the conversation, providing answers that build upon previous questions for a more natural interaction.

- **Multi-page Content Integration**: The application uses Typhoon's ability to process and integrate information from multiple pages into a coherent knowledge base for answering complex questions spanning different sections of the website.

## Getting Started (Local Development)

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Typhoon API key
- Firecrawl API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/typhoon-chat-with-your-website.git
   cd typhoon-chat-with-your-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   TYPHOON_API_KEY=your_typhoon_api_key_here
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   MAX_CRAWL_PAGES=10  # Optional: Limit the number of pages to crawl (default: 10)
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the LICENSE file for details.

## Connect With Us

- Website: [Typhoon](https://opentyphoon.ai)
- GitHub: [SCB 10X](https://github.com/scb-10x)
- Hugging Face: [SCB 10X](https://huggingface.co/scb10x)
- Discord: [Join our community](https://discord.com/invite/9F6nrFXyNt)
- X (formerly Twitter): [Typhoon](https://x.com/opentyphoon)