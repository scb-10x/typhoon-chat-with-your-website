import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Language } from './UrlInput';
import ReactMarkdown from 'react-markdown';
import { TyphoonModel } from './ModelSelector';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  url: string;
  isVisible: boolean;
  onSendMessage: (messages: Message[]) => Promise<string>;
  isPartialData?: boolean;
  language: Language;
  model?: TyphoonModel;
}

// Helper function to render message content with formatted citations and markdown
const renderMessageContent = (content: string) => {
  // Regular expression to match [Source: URL] patterns
  const sourceRegex = /\[Source: (https?:\/\/[^\]]+)\]/g;
  
  if (!content.match(sourceRegex)) {
    return (
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a target="_blank" rel="noopener noreferrer" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  
  // Split the content by the citation pattern
  const parts = content.split(sourceRegex);
  const matches = Array.from(content.matchAll(sourceRegex));
  
  const elements: React.ReactNode[] = [];
  
  // Add the first part of the text (before any citation)
  if (parts[0]) {
    elements.push(
      <span key="part-0" className="markdown-content">
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a target="_blank" rel="noopener noreferrer" {...props} />
            ),
          }}
        >
          {parts[0]}
        </ReactMarkdown>
      </span>
    );
  }
  
  // Add each matched citation and the text that follows it
  matches.forEach((match, index) => {
    const url = match[1];
    const text = parts[index + 1];
    
    // Add the citation
    elements.push(
      <a
        key={`source-${index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2 py-1 my-1 mx-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14.828 14.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
          />
        </svg>
        Source
      </a>
    );
    
    // Add the text that follows this citation if it exists
    if (text) {
      elements.push(
        <span key={`part-${index + 1}`} className="markdown-content">
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </span>
      );
    }
  });
  
  return <div>{elements}</div>;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  url, 
  isVisible, 
  onSendMessage, 
  isPartialData = false,
  language = 'en',
  model = 'typhoon-v2-70b-instruct'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'th' 
        ? isPartialData 
          ? `สวัสดีครับ! ผมกำลังวิเคราะห์เนื้อหาจาก ${url} แบบเรียลไทม์ คุณสามารถถามคำถามได้ แต่คำตอบของผมจะอิงจากข้อมูลบางส่วนและอาจไม่สมบูรณ์จนกว่าการเก็บข้อมูลจะเสร็จสิ้น`
          : `สวัสดีครับ! ผมได้วิเคราะห์เนื้อหาจาก ${url} แล้ว คุณอยากรู้อะไรเกี่ยวกับเว็บไซต์นี้บ้าง?`
        : isPartialData 
          ? `Hi there! I'm analyzing content from ${url} in real-time. You can ask questions, but my answers will be based on partial data until the crawl completes.`
          : `Hi there! I've analyzed the content from ${url}. What would you like to know about it?`,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRootLevelUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return !urlObj.pathname || urlObj.pathname === '/';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update the initial message if isPartialData changes
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: language === 'th' 
          ? isPartialData 
            ? `สวัสดีครับ! ผมกำลังวิเคราะห์เนื้อหาจาก ${url} แบบเรียลไทม์ คุณสามารถถามคำถามได้ แต่คำตอบของผมจะอิงจากข้อมูลบางส่วนและอาจไม่สมบูรณ์จนกว่าการเก็บข้อมูลจะเสร็จสิ้น`
            : `สวัสดีครับ! ผมได้วิเคราะห์เนื้อหาจาก ${url} แล้ว ${isRootLevelUrl(url) ? '(วิเคราะห์สูงสุด 10 หน้า)' : '(วิเคราะห์เฉพาะหน้าที่ระบุ)'} คุณอยากรู้อะไรเกี่ยวกับเว็บไซต์นี้บ้าง?`
          : isPartialData 
            ? `Hi there! I'm analyzing content from ${url} in real-time. You can ask questions, but my answers will be based on partial data until the crawl completes.`
            : `Hi there! I've analyzed the content from ${url} ${isRootLevelUrl(url) ? '(up to 10 pages)' : '(specific page only)'}. What would you like to know about it?`,
        timestamp: new Date(),
      },
    ]);
  }, [isPartialData, url, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLastUserMessage(newMessage);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Send the entire message history
      const response = await onSendMessage(updatedMessages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastUserMessage || isLoading || isRegenerating) return;
    
    // Find the last user message and the corresponding assistant response
    let lastUserMessageIndex = -1;
    let lastAssistantMessageIndex = -1;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if(lastAssistantMessageIndex !== -1 && lastUserMessageIndex !== -1) {
        break;
      }
      if (messages[i].role === 'user' && lastUserMessageIndex === -1) {
        lastUserMessageIndex = i;
      } else if (messages[i].role === 'assistant' && lastAssistantMessageIndex === -1) {
        lastAssistantMessageIndex = i;
      }
    }
    
    // If we couldn't find the last user message or assistant response, return
    if (lastUserMessageIndex === -1) return;
    console.log('lastAssistantMessageIndex', lastAssistantMessageIndex, 'lastUserMessageIndex', lastUserMessageIndex, messages);
    setIsRegenerating(true);
    
    try {
      // Send the entire message history up to the last user message
      const messageHistory = messages.slice(0, lastUserMessageIndex + 1);
      const response = await onSendMessage(messageHistory);
      
      // Create a new assistant message with the regenerated response
      const aiMessage: Message = {
        id: lastAssistantMessageIndex !== -1 ? messages[lastAssistantMessageIndex].id : (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      // Update the messages array by replacing the last assistant message or adding a new one
      setMessages((prev) => {
        const newMessages = [...prev];
        if (lastAssistantMessageIndex !== -1) {
          // Replace the existing assistant message
          newMessages[lastAssistantMessageIndex] = aiMessage;
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Error regenerating message:', error);
      
      const errorMessage: Message = {
        id: lastAssistantMessageIndex !== -1 ? messages[lastAssistantMessageIndex].id : (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error regenerating the response. Please try again.',
        timestamp: new Date(),
      };
      
      // Update the messages array by replacing the last assistant message or adding a new one
      setMessages((prev) => {
        const newMessages = [...prev];
        if (lastAssistantMessageIndex !== -1) {
          // Replace the existing assistant message
          newMessages[lastAssistantMessageIndex] = errorMessage;
        }
        return newMessages;
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // Function to check if a message is the last assistant message
  const isLastAssistantMessage = (message: Message, index: number) => {
    if (message.role !== 'assistant') return false;
    
    // Check if there are any assistant messages after this one
    for (let i = index + 1; i < messages.length; i++) {
      if (messages[i].role === 'assistant') return false;
    }
    
    return true;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg border ${isPartialData ? 'border-yellow-100' : 'border-gray-100'} overflow-hidden dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className={`p-3 sm:p-4 ${isPartialData ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Chat with this Website</h2>
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium self-start sm:self-auto">
              {language === 'th' ? 'ภาษาไทย' : 'English'}
            </div>
            <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium self-start sm:self-auto">
              {model}
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm opacity-80 mt-1">
          {isPartialData 
            ? `Ask questions about the partial content from ${url} (crawl in progress)`
            : `Ask questions about the content from ${url}`}
        </p>
      </div>
      
      <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
              }`}
            >
              <div className={`text-sm sm:text-base ${message.role === 'user' ? '' : 'markdown-content'}`}>
                {message.role === 'user' ? (
                  <p className="whitespace-pre-line">{message.content}</p>
                ) : (
                  isRegenerating && isLastAssistantMessage(message, index) ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '300ms' }}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Regenerating...</span>
                    </div>
                  ) : (
                    renderMessageContent(message.content)
                  )
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {isLastAssistantMessage(message, index) && message.id !== '1' && (
                  <button 
                    onClick={handleRegenerate}
                    disabled={isLoading || isRegenerating}
                    className={`text-xs ${isRegenerating ? 'text-indigo-400 dark:text-indigo-300 animate-pulse' : 'text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-300'} transition-colors`}
                    title="Replace this response with a new one"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 p-2 sm:p-3 rounded-lg rounded-bl-none dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce dark:bg-gray-600" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        {messages.length > 1 && lastUserMessage && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleRegenerate}
              disabled={isLoading || isRegenerating}
              className={`flex items-center text-xs ${isRegenerating ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'} transition-colors`}
              title="Replace the last assistant response with a new one"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{isRegenerating ? 'Regenerating...' : 'Replace last response'}</span>
              <span className="sm:hidden">{isRegenerating ? 'Regenerating...' : 'Replace'}</span>
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your question here..."
            className="flex-grow px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading || isRegenerating}
          />
          <button
            type="submit"
            disabled={isLoading || isRegenerating || !newMessage.trim()}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-medium rounded-lg disabled:opacity-50 hover:opacity-90 transition-all"
          >
            <span className="hidden sm:inline">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatInterface; 