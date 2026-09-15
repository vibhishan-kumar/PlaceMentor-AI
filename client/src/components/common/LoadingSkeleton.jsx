import React from 'react';

export const ChatSkeleton = () => (
  <div className="flex flex-col gap-4 p-4 animate-pulse">
    <div className="flex gap-3 items-start max-w-xl">
      <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-3 items-start justify-end max-w-xl self-end">
      <div className="space-y-2 flex-1 items-end">
        <div className="h-4 bg-teal-950/60 rounded w-2/3 ml-auto" />
      </div>
      <div className="w-8 h-8 rounded-full bg-teal-900/60 shrink-0" />
    </div>
    <div className="flex gap-3 items-start max-w-2xl">
      <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-800 rounded w-4/6" />
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-4">
    <div className="h-5 bg-slate-800 rounded w-1/3" />
    <div className="h-4 bg-slate-800/70 rounded w-full" />
    <div className="h-4 bg-slate-800/70 rounded w-4/5" />
    <div className="flex gap-2 pt-2">
      <div className="h-8 bg-slate-800 rounded-lg w-24" />
      <div className="h-8 bg-slate-800 rounded-lg w-20" />
    </div>
  </div>
);
