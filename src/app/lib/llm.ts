import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { ScrapedData } from "./scraper";
import { LanguageCode } from "../lib/i18n";
import { TyphoonModel } from "../lib/const";
import { Message } from "../components/ChatInterface";
import { MODEL_PARAMETERS } from "./const";

// Language code to full name mapping
const languageCodeToName: Record<string, string> = {
  en: "English",
  th: "Thai",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  // Add more language mappings as needed
};

/**
 * Get language-specific instructions for LLM prompts
 * @param language The language code or name
 * @returns Language-specific instructions
 */
export function getLanguageInstructions(language: string): string {
  // Convert language code to full name if needed
  const languageName =
    language.length <= 2 ? languageCodeToName[language] || language : language;

  let languagePrompt = `Respond in ${languageName}.`;

  // Add language-specific instructions
  switch (language) {
    case "zh":
    case "Chinese":
    case "中文":
      languagePrompt += " 在中文和英文之间添加适当的空格来提升可读性";
      break;
    case "ja":
    case "Japanese":
    case "日本語":
      languagePrompt +=
        " 日本語で回答する際は、専門用語には適宜英語を併記してください。";
      break;
    case "ko":
    case "Korean":
    case "한국어":
      languagePrompt +=
        " 한국어로 응답할 때는 전문 용어에 영어를 함께 표기해 주세요.";
      break;
    case "th":
    case "Thai":
    case "ไทย":
      languagePrompt +=
        " เมื่อตอบเป็นภาษาไทย กรุณาใช้คำศัพท์ที่เข้าใจง่ายและเพิ่มคำศัพท์ภาษาอังกฤษสำหรับคำศัพท์เฉพาะทาง";
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
  if (result.includes("</think>")) {
    return result.split("</think>")[1].trim();
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
    baseURL: process.env.TYPHOON_BASE_URL || 'https://api.opentyphoon.ai/v1',
    apiKey: process.env.TYPHOON_API_KEY || process.env.OPENAI_API_KEY || "",
    name: "typhoon", // Change the provider name to typhoon
    compatibility: "compatible", // Use compatible mode for 3rd party providers
  });

  return client(modelId);
};

const maxContextLengthPerPage = (totalPages: number, model: TyphoonModel) => {
  return Math.floor(MODEL_PARAMETERS[model].maxContentLength / totalPages);
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
  language: LanguageCode = "en",
  model: TyphoonModel = "typhoon-v2-70b-instruct"
): Promise<string> {
  try {
    // Get language-specific instructions
    const languageInstructions = getLanguageInstructions(language);

    // Prepare the prompt for summarization
    const prompt = `
      You are an AI assistant that summarizes website content.
      
      ${languageInstructions}
      
      Main Website URL: ${data.mainUrl}
      Main Website Title: ${data.mainTitle}
      Total Pages Crawled: ${data.totalPages}
      
      If the website content is blocked, please say so.
      Please provide a comprehensive summary of the following website content.
      Focus on the main topics, key information, and overall purpose of the website.
      Format your response in clear paragraphs with appropriate spacing.
      Keep your summary concise.
      
      Website Content (from ${data.pages.length} pages):
      ${data.pages
        .map(
          (page, index) => `
        --- Page ${index + 1}: ${page.url} ---
        Title: ${page.title}
        ${page.description ? `Description: ${page.description}\n` : ""}
        Content:
        ${page.content.substring(0, maxContextLengthPerPage(data.totalPages, model))} ${page.content.length > maxContextLengthPerPage(data.totalPages, model) ? "... (content truncated)" : ""
            }
      `
        )
        .join("\n\n")}
    `;

    // Generate text using Vercel AI SDK with Typhoon
    const { text } = await generateText({
      model: typhoon(model),
      prompt: prompt,
      maxTokens: MODEL_PARAMETERS[model].maxTokens,
      temperature: MODEL_PARAMETERS[model].temperature,
    });

    // Process the response to extract the result after any thinking
    return extractResultFromThinking(text.trim());
  } catch (error) {
    console.error("Error summarizing website:", error);
    throw new Error(`Failed to summarize website: ${(error as Error).message}`);
  }
}

/**
 * Chats with the website content using Typhoon API via Vercel AI SDK
 * @param data The scraped website data
 * @param messages The array of messages in the conversation
 * @param lastMessage The last user message/question
 * @param language The language to generate the response in (default: 'en')
 * @param model The Typhoon model to use (default: 'typhoon-v2-70b-instruct')
 * @returns The AI's response based on the website content
 */
export async function chatWithWebsite(
  data: ScrapedData,
  messages: Message[],
  lastMessage: string,
  language: LanguageCode = "en",
  model: TyphoonModel = "typhoon-v2-70b-instruct"
): Promise<string> {
  try {
    // Prepare the prompt for chat based on language
    let systemPrompt = "";

    if (language === "th") {
      systemPrompt = `
        คุณเป็นผู้ช่วย AI ที่ช่วยผู้ใช้เข้าใจเนื้อหาเว็บไซต์
        
        URL เว็บไซต์หลัก: ${data.mainUrl}
        ชื่อเว็บไซต์: ${data.mainTitle}
        จำนวนหน้าทั้งหมด: ${data.totalPages}
        
        โปรดตอบคำถามของผู้ใช้ตามเนื้อหาเว็บไซต์ต่อไปนี้
        หากคำตอบไม่อยู่ในเนื้อหา คุณสามารถบอกว่าคุณไม่มีข้อมูลนั้น
        
        สำคัญ:
        1. เนื้อหาอาจรวมข้อมูลจากหลายหน้าของเว็บไซต์หรือเว็บไซต์ที่เกี่ยวข้อง
        2. เมื่อให้ข้อมูล ใช้การอ้างอิงแบบตัวเลขเช่น [1], [2], ฯลฯ
        3. สำหรับการอ้างอิงแต่ละรายการ จำ URL เฉพาะที่ข้อมูลมาจาก
        4. ท้ายคำตอบของคุณ ให้รวมส่วนอ้างอิงในรูปแบบ markdown ที่แสดงรายการ URL แหล่งที่มาทั้งหมด
        5. จัดรูปแบบส่วนอ้างอิงดังนี้:
           
           **อ้างอิง:**
           [1]: [URL จริงสำหรับการอ้างอิง 1]
           [2]: [URL จริงสำหรับการอ้างอิง 2]
           
        6. คำตอบของคุณควรอยู่ในรูปแบบ markdown
        7. รักษาคำตอบของคุณให้กระชับ
        
        เนื้อหาเว็บไซต์ (จาก ${data.pages.length} หน้า):
        ${data.pages
          .map(
            (page, index) => `
          --- หน้า ${index + 1}: ${page.url} ---
          ชื่อหน้า: ${page.title}
          ${page.description ? `คำอธิบาย: ${page.description}\n` : ""}
          เนื้อหา:
          ${page.content.substring(0, maxContextLengthPerPage(data.totalPages, model))} ${page.content.length > maxContextLengthPerPage(data.totalPages, model) ? "... (เนื้อหาถูกตัดทอน)" : ""
              }
        `
          )
          .join("\n\n")}
      `;
    } else {
      systemPrompt = `
        You are an AI assistant that helps users understand website content.
        
        Main Website URL: ${data.mainUrl}
        Website Title: ${data.mainTitle}
        Total Pages: ${data.totalPages}
        
        Please answer the user's question based on the following website content.
        If the answer is not in the content, you can say that you don't have that information.
        
        Important:
        1. The content may include information from multiple pages or related websites
        2. When providing information, use numbered references like [1], [2], etc.
        3. For each reference, remember the specific URL where the information came from
        4. At the end of your answer, include a references section in markdown format listing all source URLs
        5. Format the references section as follows:
           
           **References:**
           [1]: [actual URL for reference 1]
           [2]: [actual URL for reference 2]
           
        6. Your answer should be in markdown format
        7. Keep your answer concise
        
        Website Content (from ${data.pages.length} pages):
        ${data.pages
          .map(
            (page, index) => `
          --- Page ${index + 1}: ${page.url} ---
          Title: ${page.title}
          ${page.description ? `Description: ${page.description}\n` : ""}
          Content:
          ${page.content.substring(0, maxContextLengthPerPage(data.totalPages, model))} ${page.content.length > maxContextLengthPerPage(data.totalPages, model) ? "... (content truncated)" : ""
              }
        `
          )
          .join("\n\n")}
      `;
    }
    if (messages.length > 0 && messages[0].role === "assistant") {
      messages.shift();
    }

    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      messages.pop();
    }

    const { text } = await generateText({
      model: typhoon(model),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
        { role: "user", content: lastMessage },
      ],
      maxTokens: MODEL_PARAMETERS[model].maxTokens,
      temperature: MODEL_PARAMETERS[model].temperature,
    });

    // Process the response to extract the result after any thinking
    return extractResultFromThinking(text.trim());
  } catch (error) {
    console.error("Error chatting with website:", error);
    throw new Error(`Failed to chat with website: ${(error as Error).message}`);
  }
}
