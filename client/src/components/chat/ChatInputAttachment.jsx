import React, { useState } from 'react';
import { FileText, X, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';

export const ChatInputAttachment = ({
  file,
  onRemove,
  targetCompany,
  setTargetCompany,
  targetRole,
  setTargetRole
}) => {
  const [showRoleInputs, setShowRoleInputs] = useState(false);

  if (!file) return null;

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = file.type?.startsWith('image/');

  return (
    <div className="mb-2 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs shadow-lg animate-fadeIn space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 truncate" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-400 border border-slate-700 font-mono shrink-0 uppercase">
                {isImage ? 'IMAGE' : 'PDF'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {formatSize(file.size)} • Ready for AI ATS & placement evaluation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowRoleInputs(!showRoleInputs)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Add target company/role"
          >
            <span>Target Role</span>
            {showRoleInputs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showRoleInputs && (
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
          <div className="relative">
            <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Target Company (e.g. Micron, Oracle)"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Target Role (e.g. SDE, Data Engineer)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
