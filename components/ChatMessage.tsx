import React from 'react';
import { Message } from '../types';
import ChartRenderer from './ChartRenderer';
import { User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div 
            className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isUser 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}
          >
            {message.isStreaming && !message.content ? (
               <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
               <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            )}
          </div>

          {/* Chart Rendering Area */}
          {!isUser && message.chart && (
            <div className="w-full mt-2 min-w-[300px] md:min-w-[450px]">
              <ChartRenderer config={message.chart} />
            </div>
          )}
          
          <span className="text-xs text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
