import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export const ChatInput = ({ onSendMessage, disabled, placeholder }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl focus-within:border-teal-500/60 focus-within:ring-1 focus-within:ring-teal-500/30 transition-all backdrop-blur-md"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Ask PlaceMentor AI about DSA, HR questions, company processes, or interview prep...'}
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none py-2 px-3 focus:outline-none min-h-[44px] max-h-[180px] leading-relaxed"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`p-2.5 rounded-xl shrink-0 transition-all ${
            input.trim() && !disabled
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
      <p className="text-[11px] text-center text-slate-500 mt-2">
        Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">Shift + Enter</kbd> for new line. PlaceMentor AI answers placement & career queries.
      </p>
    </div>
  );
};
