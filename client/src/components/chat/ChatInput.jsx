import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ArrowUp,
  Square,
  Mic,
  Brain,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ChatInputAttachment } from './ChatInputAttachment';
import { useToast } from '../../context/ToastContext';

export const ChatInput = ({ onSendMessage, disabled, placeholder }) => {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a PDF, JPG, JPEG or PNG resume.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setAttachedFile(file);
    toast.success(`Resume "${file.name}" attached. Send to analyze!`);
    // Reset file input value so same file can be re-selected if removed
    e.target.value = '';
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setTargetCompany('');
    setTargetRole('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if ((!trimmed && !attachedFile) || disabled) return;

    onSendMessage(trimmed, attachedFile, targetCompany.trim(), targetRole.trim());
    setInput('');
    removeAttachment();

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

  const hasContent = input.trim().length > 0 || attachedFile !== null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-3 pt-1">
      {/* Attached Resume Chip */}
      <ChatInputAttachment
        file={attachedFile}
        onRemove={removeAttachment}
        targetCompany={targetCompany}
        setTargetCompany={setTargetCompany}
        targetRole={targetRole}
        setTargetRole={setTargetRole}
      />

      {/* Hidden File Input for + button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ChatGPT-Style Pill Input Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-xl focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500/30 transition-all backdrop-blur-md"
      >
        {/* Left Plus (+) Icon for Resume Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Resume (PDF, Image)"
          className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            attachedFile
              ? `Ask anything about this resume, or press Send to analyze...`
              : placeholder || 'Ask anything...'
          }
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 resize-none py-2 px-1 focus:outline-none min-h-[40px] max-h-[180px] leading-relaxed"
        />

        {/* Right Action Icons: Think, Mic, and Send */}
        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          {/* Think Toggle */}
          <button
            type="button"
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              isThinkingMode
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Placement Reasoning Mode"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Think</span>
          </button>

          {/* Voice / Mic Icon (Cosmetic/ChatGPT-like) */}
          <button
            type="button"
            onClick={() => toast.info('Voice input is coming soon! Type your prompt or click + to upload a resume.')}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex"
            title="Voice prompt"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send / Stop Button (Black circle with white arrow, matching screenshot) */}
          <button
            type="submit"
            disabled={!hasContent || disabled}
            title={disabled ? 'Thinking...' : 'Send message'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              disabled
                ? 'bg-slate-100 text-slate-900 cursor-not-allowed'
                : hasContent
                ? 'bg-white text-slate-950 hover:bg-slate-200 active:scale-95 shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {disabled ? (
              <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {/* ChatGPT-Style Disclaimer */}
      <p className="text-[11px] text-center text-slate-500 mt-2">
        PlaceMentor AI can make mistakes. Check important placement info.
      </p>
    </div>
  );
};
