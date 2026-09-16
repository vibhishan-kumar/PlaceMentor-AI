import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import {
  PanelLeftOpen,
  SquarePen,
  Share2,
  MoreHorizontal,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export const ChatPage = () => {
  const {
    currentChatId,
    currentMessages,
    loadingMessages,
    sendingMessage,
    sendMessage,
    startNewChat
  } = useChat();

  const { user } = useAuth();
  const toast = useToast();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, sendingMessage]);

  const handleRegenerate = () => {
    if (currentMessages.length < 2) return;
    const lastUserMessage = [...currentMessages].reverse().find((m) => m.role === 'USER');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Conversation link copied to clipboard.');
    }
  };

  const studentFirstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 font-sans">
      {/* Collapsible Sidebar */}
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950">
        {/* Top Navigation Bar matching ChatGPT screenshot */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle button (visible when desktop sidebar collapsed or on mobile) */}
            {(isSidebarCollapsed || window.innerWidth < 768) && (
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileSidebarOpen(true);
                  } else {
                    setIsSidebarCollapsed(false);
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                title="Open sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            {isSidebarCollapsed && (
              <button
                onClick={() => startNewChat()}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                title="New chat"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 ml-1">
              <span>PlaceMentor AI</span>
            </div>
          </div>

          {/* Right Header Actions matching ChatGPT (Share & More) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              title="Share conversation"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => toast.info(`PlaceMentor AI is actively mentoring for ${user?.program || 'UoH'} campus placements.`)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loadingMessages ? (
            <ChatSkeleton />
          ) : currentMessages.length === 0 ? (
            /* Clean Empty Greeting State matching ChatGPT screenshot */
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fadeIn max-w-xl mx-auto">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Hi {studentFirstName}! 👋
                </h2>
                <p className="text-sm sm:text-base text-slate-400 font-medium">
                  How can I help you today? 😊
                </p>
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-lg">
                {[
                  'Prepare me for technical interview',
                  'Give me top DSA questions',
                  'What skills are needed for SDE roles?',
                  'Help me prepare for HR rounds'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-xs text-slate-300 hover:text-white transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col py-4 space-y-2">
              {currentMessages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || index}
                  message={msg}
                  isLast={index === currentMessages.length - 1}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Typing indicator */}
              {sendingMessage && (
                <div className="w-full py-4 px-4 sm:px-6 animate-fadeIn">
                  <div className="max-w-3xl mx-auto flex gap-4 items-center">
                    <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Sticky ChatGPT-style Bottom Input */}
        <div className="shrink-0 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-2">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={sendingMessage || loadingMessages}
          />
        </div>
      </div>
    </div>
  );
};
