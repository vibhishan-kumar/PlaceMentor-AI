import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  FileText
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ChatMessage = ({ message, isLast, onRegenerate }) => {
  const isUser = message.role === 'USER';
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if user message contains attached resume markup
  const attachmentMatch = isUser && message.content.match(/📎 \*\*Attached Resume:\*\* `([^`]+)`/);
  const cleanUserContent = isUser && attachmentMatch
    ? message.content.replace(/📎 \*\*Attached Resume:\*\* `[^`]+`\s*/, '')
    : message.content;

  if (isUser) {
    return (
      <div className="w-full py-2 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex justify-end">
          <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] space-y-1.5">
            {/* Attached file card (if any) */}
            {attachmentMatch && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 shadow-md">
                <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-medium truncate max-w-[200px]" title={attachmentMatch[1]}>
                  {attachmentMatch[1]}
                </span>
              </div>
            )}

            {/* User message pill matching ChatGPT screenshot */}
            {cleanUserContent && (
              <div className="px-4 py-2.5 rounded-3xl bg-slate-800 text-white text-sm font-normal leading-relaxed shadow-sm break-words whitespace-pre-wrap">
                {cleanUserContent}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AI Assistant Response (ChatGPT-style left-aligned clean stream)
  return (
    <div className="w-full py-4 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        {/* Assistant Avatar/Icon */}
        <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="prose-chat text-slate-200 text-sm leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeText = String(children).replace(/\n$/, '');

                  if (!inline) {
                    return (
                      <div className="relative group/code my-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                          <span>{match ? match[1] : 'code'}</span>
                          <button
                            onClick={() => copyToClipboard(codeText)}
                            className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="p-4 text-xs overflow-x-auto font-mono text-teal-300">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-teal-300 font-mono text-xs" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Assistant Action Buttons */}
          <div className="flex items-center gap-2 pt-1 text-slate-500">
            <button
              onClick={() => copyToClipboard(message.content)}
              title="Copy response"
              className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                title="Regenerate response"
                className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
