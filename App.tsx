import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, X, Sparkles } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import PortfolioSummary from './components/PortfolioSummary';
import { Message } from './types';
import { getChatSession, parseResponse } from './services/geminiService';
import { GenerateContentResponse } from "@google/genai";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm FinChart. I have analyzed your portfolio. I can visualize your data, track performance, or analyze specific holdings. Try asking: **\"Show my asset allocation\"** or **\"How is Tech performing?\"**",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a temporary placeholder for the bot response
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }]);

      const chat = getChatSession();
      const result = await chat.sendMessageStream({ message: userMessage.content });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        if (chunkText) {
          fullText += chunkText;
          
          // Streaming update (pure text only for now, we parse chart at end to avoid JSON artifacts)
          // To make it look clean, we only show text that ISN'T inside the JSON block code
          const displayCurrently = fullText.split('```json')[0];

          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: displayCurrently } 
              : msg
          ));
        }
      }

      // Final parse once stream is complete
      const { text, chart } = parseResponse(fullText);
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { 
              ...msg, 
              content: text, 
              chart: chart,
              isStreaming: false 
            } 
          : msg
      ));

    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error while processing your request. Please check your API key and try again.",
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    "Visualize my asset allocation",
    "Show my portfolio value history",
    "Compare Apple and Microsoft",
    "What is my biggest winner?",
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-gray-600">
                <Menu size={24} />
              </button>
            </div>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-emerald-200 shadow-md">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">FinChart <span className="text-emerald-600 font-medium text-sm bg-emerald-50 px-2 py-0.5 rounded-full">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center text-sm text-gray-500">
            Powered by Gemini 2.5
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 pb-6 lg:pb-8">
          <div className="max-w-3xl mx-auto">
            
            {/* Suggestions (only show if few messages) */}
            {messages.length < 3 && (
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {suggestedQueries.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        setInput(q);
                        // Optional: auto-send or just fill
                    }}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors border border-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your portfolio..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2 text-gray-800 placeholder-gray-400"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl flex-shrink-0 mb-0.5 transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">FinChart AI can make mistakes. Please verify financial data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Portfolio Summary */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:w-96 lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="lg:hidden absolute top-4 right-4 z-50">
           <button onClick={() => setSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
             <X size={20} />
           </button>
        </div>
        <PortfolioSummary />
      </div>

    </div>
  );
}

export default App;
