import React from 'react';
import {
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  ListPlus,
  HelpCircle
} from 'lucide-react';

export const RoleMatchCard = ({ matchData, targetCompany, targetRole }) => {
  if (!matchData) return null;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Company & Role Alignment Analysis
          </div>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>{targetCompany || matchData.targetCompany || 'Target Company'}</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-teal-300 font-medium">
              {targetRole || matchData.targetRole || 'Target Role'}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Role Match
            </span>
            <span className="text-2xl font-extrabold text-teal-400">
              {matchData.matchPercentage ?? 85}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 bg-teal-950/40 flex items-center justify-center font-bold text-teal-300 text-sm">
            {matchData.matchPercentage ?? 85}%
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Skills */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Matching Skills Found in Resume
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchData.matchingSkills?.length > 0 ? (
              matchData.matchingSkills.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No direct skill matches found.</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
            <XCircle className="w-4 h-4" />
            Missing Skills Required for this Role
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchData.missingSkills?.length > 0 ? (
              matchData.missingSkills.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400">All major role skills covered!</span>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations & Actionable Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Recommended Projects */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <h4 className="font-semibold text-slate-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Recommended Projects for this Company
          </h4>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {matchData.recommendedProjects?.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* ATS Keywords to Add */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
          <h4 className="font-semibold text-slate-200 flex items-center gap-2">
            <ListPlus className="w-4 h-4 text-teal-400" />
            ATS Keywords to Incorporate
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchData.atsKeywordsSuggestions?.map((k, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Prep Suggestions */}
      {matchData.interviewPrepSuggestions?.length > 0 && (
        <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/20 space-y-2">
          <h4 className="font-semibold text-teal-300 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            Interview Preparation Focus for {targetCompany || 'this role'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            {matchData.interviewPrepSuggestions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
