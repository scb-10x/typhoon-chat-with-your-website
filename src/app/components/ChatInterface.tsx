import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TyphoonModel } from '../lib/const';

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
        className="inline-flex items-center px-2 py-1 my-1 mx-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200 transition-colors shadow-sm"
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
  model = 'typhoon-v2-70b-instruct'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isPartialData
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
        content: isPartialData
          ? `Hi there! I'm analyzing content from ${url} in real-time. You can ask questions, but my answers will be based on partial data until the crawl completes.`
          : `Hi there! I've analyzed the content from ${url} ${isRootLevelUrl(url) ? '(up to 10 pages)' : '(specific page only)'}. What would you like to know about it?`,
        timestamp: new Date(),
      },
    ]);
  }, [isPartialData, url]);

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
      if (lastAssistantMessageIndex !== -1 && lastUserMessageIndex !== -1) {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg transition-all duration-300 glass-effect border border-gray-200`}
      id="chat-interface-container"
      style={{ height: isVisible ? 'auto' : '0px', marginTop: isVisible ? '1.5rem' : '0' }}
    >
      <div className="flex flex-col h-full" id="chat-interface-inner">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-600 text-white p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-2" id="chat-interface-header">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-medium" id="chat-interface-title">
              Chat with{' '}
              <span className="font-semibold underline decoration-2 underline-offset-2">
                {url}
              </span>
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isPartialData && (
              <span className="text-xs bg-yellow-400 text-yellow-800 py-1 px-2 rounded-full inline-flex items-center shadow-sm" id="chat-partial-data-badge">
                <svg className="animate-pulse mr-1 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Analyzing
              </span>
            )}
            <span className="text-xs bg-white/20 py-1 px-3 rounded-full backdrop-blur-sm shadow-sm" id="chat-model-badge">
              {model}
            </span>
          </div>
        </div>

        <div
          className="flex-grow overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-white"
          style={{ maxHeight: '450px', minHeight: '350px' }}
          id="chat-messages-container"
        >
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              id={`chat-message-${message.id}`}
            >
              <div
                className={`max-w-3/4 rounded-lg px-4 py-3 shadow-sm ${message.role === 'user'
                  ? 'bg-indigo-100 text-indigo-900 rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  } ${isLastAssistantMessage(message, index) && isRegenerating ? 'opacity-50' : ''}`}
                id={`chat-message-bubble-${message.id}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center mb-2 border-b border-gray-200 pb-2" id={`chat-message-header-${message.id}`}>
                    <div className="w-6 h-6 mr-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      AI
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
                <div className="text-sm md:text-base">
                  {renderMessageContent(message.content)}
                </div>
                {message.role === 'user' && (
                  <div className="flex items-center justify-end mt-2 border-t border-gray-200 pt-2" id={`chat-message-footer-${message.id}`}>
                    <div className="text-xs text-gray-500 mr-2">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      You
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isRegenerating && (
            <div className="flex justify-center my-4">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-sm text-indigo-800 shadow-sm" id="chat-regenerating-indicator">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Regenerating...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2" id="chat-input-form">
            <div className="flex-grow relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your question here..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                disabled={isLoading || isRegenerating}
                id="chat-input-field"
              />
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isLoading || isRegenerating}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors"
                  id="chat-regenerate-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || isRegenerating || !newMessage.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 shadow-sm"
              id="chat-submit-button"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface; 