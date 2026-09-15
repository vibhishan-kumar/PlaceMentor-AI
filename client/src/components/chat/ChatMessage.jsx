import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  GraduationCap,
  User,
  Copy,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ChatMessage = ({ message, isLast, onRegenerate }) => {
  const isUser = message.role === 'USER';
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Message copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-full py-5 px-4 sm:px-6 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-slate-900/50 border-y border-slate-800/40'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-semibold text-xs shadow-md ${
            isUser
              ? 'bg-slate-800 text-teal-400 border border-slate-700'
              : 'bg-gradient-to-tr from-teal-600 to-teal-400 text-slate-950 shadow-teal-500/10'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              {isUser ? 'You' : 'PlaceMentor AI'}
            </span>
            <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyToClipboard(message.content)}
                title="Copy response"
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {!isUser && isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Regenerate response"
                  className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="prose-chat text-slate-200 break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeText = String(children).replace(/\n$/, '');

                  if (!inline) {
                    return (
                      <div className="relative group/code my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
                          <span>{match ? match[1] : 'code'}</span>
                          <button
                            onClick={() => copyToClipboard(codeText)}
                            className="flex items-center gap-1 hover:text-teal-400 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="p-3 text-xs overflow-x-auto font-mono text-teal-300">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-xs" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
