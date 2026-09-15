import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatWelcome } from '../components/chat/ChatWelcome';
import { ChatSkeleton } from '../components/common/LoadingSkeleton';
import { Menu, Plus, Sparkles, AlertCircle } from 'lucide-react';

export const ChatPage = () => {
  const {
    currentChatId,
    currentMessages,
    loadingMessages,
    sendingMessage,
    sendMessage,
    startNewChat
  } = useChat();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, sendingMessage]);

  const handleSelectQuickPrompt = (promptText) => {
    sendMessage(promptText);
  };

  const handleRegenerate = () => {
    if (currentMessages.length < 2) return;
    const lastUserMessage = [...currentMessages].reverse().find((m) => m.role === 'USER');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <ChatSidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/60">
        {/* Chat Header for Mobile & Quick Actions */}
        <div className="h-12 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Placement Advisor
            </span>
          </div>

          <button
            onClick={() => startNewChat()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:text-teal-400 hover:border-teal-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loadingMessages ? (
            <ChatSkeleton />
          ) : currentMessages.length === 0 ? (
            <ChatWelcome onSelectPrompt={handleSelectQuickPrompt} />
          ) : (
            <div className="flex flex-col pb-4">
              {currentMessages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || index}
                  message={msg}
                  isLast={index === currentMessages.length - 1}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Typing indicator while AI generates response */}
              {sendingMessage && (
                <div className="w-full py-5 px-4 sm:px-6 bg-slate-900/50 border-y border-slate-800/40 animate-fadeIn">
                  <div className="max-w-3xl mx-auto flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-slate-950 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-xs text-slate-400 ml-2 font-medium">PlaceMentor AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Sticky Chat Input */}
        <div className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={sendingMessage || loadingMessages}
          />
        </div>
      </div>
    </div>
  );
};
