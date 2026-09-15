import React from 'react';
import { Award, CheckCircle, AlertTriangle } from 'lucide-react';

export const ScoreCard = ({ title, score, subtitle, icon: Icon, badge }) => {
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (val >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  const getProgressColor = (val) => {
    if (val >= 80) return 'from-emerald-500 to-teal-400';
    if (val >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  return (
    <div className="relative overflow-hidden p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {score}
            </span>
            <span className="text-sm font-medium text-slate-500">/ 100</span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-2xl border ${getScoreColor(score)}`}>
          {Icon ? <Icon className="w-6 h-6" /> : <Award className="w-6 h-6" />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(score)} transition-all duration-1000`}
          style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
        />
      </div>
    </div>
  );
};
