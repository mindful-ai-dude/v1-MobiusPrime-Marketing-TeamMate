import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, ModelType } from '../types';
import { createChatSession, sendChatMessage } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatWidgetProps {
  apiKey: string;
  model: ModelType;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ apiKey, model }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hi! I'm MobiusPrime. Ask me anything about your marketing strategy.",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    if (apiKey) {
      try {
        // We prefer gemini-3-pro-preview for chat as requested, or fall back to selected model
        const chatModel = model === ModelType.GEMINI_3_PRO ? model : ModelType.GEMINI_3_PRO;
        const session = createChatSession(apiKey, chatModel);
        setChatSession(session);
      } catch (error) {
        console.error("Failed to init chat", error);
      }
    }
  }, [apiKey, model]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || !apiKey) return;
    
    if (!chatSession) {
      alert("Please enter your API Key in the top right corner first.");
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(chatSession, userMsg.text);
      
      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "I encountered an error processing your request. Please check your API key and try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#1a2336] border border-white/20 rounded-2xl shadow-2xl w-[350px] md:w-[450px] h-[600px] mb-4 flex flex-col overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-600/20 to-teal-500/20 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                MobiusPrime Chat
              </h3>
              <p className="text-xs text-gray-400">Powered by Gemini 3.0 Pro</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-purple-600/80 text-white rounded-br-none' 
                      : 'bg-white/10 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <MarkdownRenderer content={msg.text} />
                  <span className="text-[10px] opacity-50 block mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0f172a] border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none h-12"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="bg-teal-500 hover:bg-teal-400 text-white rounded-xl px-4 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">Gemini may produce inaccurate information.</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-teal-500 shadow-lg shadow-purple-900/50 flex items-center justify-center hover:scale-110 transition-all duration-300 border border-white/20"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};