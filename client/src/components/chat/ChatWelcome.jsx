import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Code2,
  FileSearch,
  HelpCircle,
  Briefcase,
  Compass,
  Building,
  Target
} from 'lucide-react';

export const ChatWelcome = ({ onSelectPrompt }) => {
  const { user } = useAuth();

  const quickPrompts = [
    {
      title: 'Technical Interview Prep',
      description: 'Prepare me for technical interview rounds and core CS fundamentals.',
      prompt: 'Prepare me for technical interview questions covering OS, DBMS, Computer Networks, and OOPS.',
      icon: Code2
    },
    {
      title: 'DSA Interview Questions',
      description: 'Top recurring campus placement coding questions with hints.',
      prompt: 'Give me top DSA interview questions frequently asked in campus placements (Arrays, Trees, Graphs, DP).',
      icon: Target
    },
    {
      title: 'Software Engineer Roles',
      description: 'Key skills, competencies, and interview expectations.',
      prompt: 'What skills are required for software engineer roles in tier-1 product companies and campus drives?',
      icon: Briefcase
    },
    {
      title: 'HR & Behavioral Interview',
      description: 'STAR framework walkthroughs and common HR questions.',
      prompt: 'Help me prepare for HR interview rounds using the STAR method for campus placements.',
      icon: HelpCircle
    },
    {
      title: 'Placement Preparation Strategy',
      description: 'Step-by-step roadmap for final and pre-final year students.',
      prompt: 'How should I prepare for campus placements at University of Hyderabad step-by-step?',
      icon: Compass
    },
    {
      title: 'Company-Specific Preparation',
      description: 'Insights into hiring processes and rounds.',
      prompt: 'Explain the typical hiring process and rounds for tech companies like Micron, Oracle, Google, and TCS.',
      icon: Building
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-fadeIn">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5 shadow-xl shadow-teal-500/20 mb-4">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
          <GraduationCap className="w-8 h-8" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight">
        Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}!
      </h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        I am <span className="text-teal-400 font-semibold">PlaceMentor AI</span>, your personalized placement and career mentor at University of Hyderabad. How can I help you prepare today?
      </p>

      {/* Quick Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8">
        {quickPrompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-850 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-slate-800 text-teal-400 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition-colors shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
