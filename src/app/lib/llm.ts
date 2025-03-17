import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { ScrapedData } from './scraper';
import { Language } from '../components/UrlInput';
import { TyphoonModel } from '../components/ModelSelector';
import { Message } from '../components/ChatInterface';

// Define the message types expected by the AI SDK
type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Language code to full name mapping
const languageCodeToName: Record<string, string> = {
  'en': 'English',
  'th': 'Thai',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  // Add more language mappings as needed
};

/**
 * Get language-specific instructions for LLM prompts
 * @param language The language code or name
 * @returns Language-specific instructions
 */
export function getLanguageInstructions(language: string): string {
  // Convert language code to full name if needed
  const languageName = language.length <= 2 ? languageCodeToName[language] || language : language;
  
  let languagePrompt = `Respond in ${languageName}.`;

  // Add language-specific instructions
  switch (language) {
    case 'zh':
    case 'Chinese':
    case '中文':
      languagePrompt += ' 在中文和英文之间添加适当的空格来提升可读性';
      break;
    case 'ja':
    case 'Japanese':
    case '日本語':
      languagePrompt += ' 日本語で回答する際は、専門用語には適宜英語を併記してください。';
      break;
    case 'ko':
    case 'Korean':
    case '한국어':
      languagePrompt += ' 한국어로 응답할 때는 전문 용어에 영어를 함께 표기해 주세요.';
      break;
    case 'th':
    case 'Thai':
    case 'ไทย':
      languagePrompt += ' เมื่อตอบเป็นภาษาไทย กรุณาใช้คำศัพท์ที่เข้าใจง่ายและเพิ่มคำศัพท์ภาษาอังกฤษสำหรับคำศัพท์เฉพาะทาง';
      break;
    // Add more language-specific instructions as needed
  }
  
  return languagePrompt;
}

/**
 * Extracts the result from a response that might contain <think>...</think> tags
 * Also cleans up JSON code blocks and extra newlines
 * @param text The response text
 * @returns The cleaned response text
 */
export function extractResultFromThinking(text: string): string {
  const result = text;
  if(result.includes('</think>')){
    return result.split('</think>')[1].trim();
  }
  return result.trim();
}

/**
 * Creates a Typhoon API client that's compatible with OpenAI
 * @param modelId The model ID to use
 * @returns A configured Typhoon API client
 */
export const typhoon = (modelId: string) => {
  const client = createOpenAI({
    baseURL: 'https://api.opentyphoon.ai/v1',
    apiKey: process.env.OPENAI_API_KEY || '',
    name: 'typhoon', // Change the provider name to typhoon
    compatibility: 'compatible', // Use compatible mode for 3rd party providers
  });
  
  return client(modelId);
};

/**
 * Summarizes website content using Typhoon API via Vercel AI SDK
 * @param data The scraped website data
 * @param language The language to generate the summary in (default: 'en')
 * @param model The Typhoon model to use (default: 'typhoon-v2-70b-instruct')
 * @returns A summary of the website content
 */
export async function summarizeWebsite(
  data: ScrapedData, 
  language: Language = 'en',
  model: TyphoonModel = 'typhoon-v2-70b-instruct'
): Promise<string> {
  try {
    // Get language-specific instructions
    const languageInstructions = getLanguageInstructions(language);
    
    // Prepare the prompt for summarization
    const prompt = `
      You are an AI assistant that summarizes website content.
      
      ${languageInstructions}
      
      Website URL: ${data.url}
      Website Title: ${data.title}
      
      Please provide a comprehensive summary of the following website content.
      Focus on the main topics, key information, and overall purpose of the website.
      Format your response in clear paragraphs with appropriate spacing.
      Keep your summary concise.
      
      Website Content:
      ${data.content.substring(0, 8000)} ${data.content.length > 8000 ? '... (content truncated)' : ''}
    `;
    
    // Generate text using Vercel AI SDK with Typhoon
    const { text } = await generateText({
      model: typhoon(model),
      prompt: prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });
    
    // Process the response to extract the result after any thinking
    return extractResultFromThinking(text.trim());
  } catch (error) {
    console.error('Error summarizing website:', error);
    throw new Error(`Failed to summarize website: ${(error as Error).message}`);
  }
}

/**
 * Chats with the website content using Typhoon API via Vercel AI SDK
 * @param data The scraped website data
 * @param messages The array of messages in the conversation
 * @param lastUserMessage The last user message/question
 * @param language The language to generate the response in (default: 'en')
 * @param model The Typhoon model to use (default: 'typhoon-v2-70b-instruct')
 * @returns The AI's response based on the website content
 */
export async function chatWithWebsite(
  data: ScrapedData, 
  messages: Message[],
  lastUserMessage: string,
  language: Language = 'en',
  model: TyphoonModel = 'typhoon-v2-70b-instruct'
): Promise<string> {
  try {
    // Get language-specific instructions
    const languageInstructions = getLanguageInstructions(language);
    
    // Create system prompt with language instructions
    const systemPrompt = `
      You are an AI assistant that helps users understand website content.
      ---
      Primary Website URL: ${data.url}
      Website Title: ${data.title}
      
      Website Content:
      ${data.content.substring(0, 8000)} ${data.content.length > 8000 ? '... (content truncated)' : ''}
      ---
      Based on the following website content, please answer the user's question.
      If the answer is not in the content, you can say that you don't have that information.
      
      IMPORTANT:
      1. The content may include information from multiple pages of the website or related websites.
      2. When providing information, use numbered citations like [1], [2], etc.
      3. For each citation, remember which specific URL the information comes from.
      4. At the end of your response, include a References section in markdown format that lists all source URLs.
      5. Format the references section like this:
         
         **References:**
         [1]: [actual URL for citation 1](actual URL for citation 1)
         [2]: [actual URL for citation 2](actual URL for citation 2)
         
      6. Your response should be formatted in markdown.
      7. Keep your response concise.
      ${languageInstructions}
    `;

    // Format the conversation messages for the API
    const formattedMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      // Skip the initial AI greeting and convert to the format expected by the API
      ...messages
        .filter(msg => msg.sender !== 'ai' || messages.indexOf(msg) !== 0)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        } as AIMessage))
    ];
    // Generate text using Vercel AI SDK with Typhoon
    const { text } = await generateText({
      model: typhoon(model),
      messages: formattedMessages,
      maxTokens: 512,
      temperature: 0.7,
    });
    
    // Process the response to extract the result after any thinking
    return extractResultFromThinking(text.trim());
  } catch (error) {
    console.error('Error chatting with website:', error);
    throw new Error(`Failed to process your question: ${(error as Error).message}`);
  }
} 