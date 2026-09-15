import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import {
  GraduationCap,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  Code2,
  Target,
  Award,
  ChevronRight,
  Zap
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { chats, startNewChat, sendMessage } = useChat();
  const navigate = useNavigate();

  const [recentResumes, setRecentResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    const fetchRecentResumes = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success) {
          setRecentResumes(res.data.resumes.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchRecentResumes();
  }, []);

  const handleQuickPrompt = async (prompt) => {
    const createdChat = await startNewChat();
    navigate('/chat');
    // Send after navigating
    setTimeout(() => {
      sendMessage(prompt);
    }, 100);
  };

  const quickPrompts = [
    { text: 'Prepare me for technical interview', icon: Code2 },
    { text: 'Give me DSA interview questions', icon: Target },
    { text: 'What skills are required for software engineer roles?', icon: Briefcase },
    { text: 'Help me prepare for HR interview', icon: Sparkles },
    { text: 'How should I prepare for campus placements?', icon: GraduationCap },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            University of Hyderabad Placement Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {user?.name || 'Student'}!
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Your personalized AI placement assistant is ready to help you crack campus drives, analyze your resume against target job descriptions, and master technical and HR rounds.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-teal-500/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Start Placement Chat
            </button>
            <button
              onClick={() => navigate('/resume-analyzer')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              Upload & Analyze Resume
            </button>
          </div>
        </div>
      </div>

      {/* Quick Placement Prompts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            Instant Preparation Prompts
          </h2>
          <span className="text-xs text-slate-500">Click to discuss with PlaceMentor AI</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(item.text)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-850 text-left transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-800 text-teal-400 group-hover:bg-teal-500/20 transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {item.text}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Chats & Recent Resumes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Recent Discussions</h3>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {chats.slice(0, 4).map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  navigate('/chat');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-all group"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(chat.updatedAt || chat.createdAt)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
              </div>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs">
                No chat history yet. Start a discussion above!
              </div>
            )}
          </div>
        </div>

        {/* Recent Resume Analyses */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Recent Resume Analyses</h3>
            </div>
            <button
              onClick={() => navigate('/my-resumes')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentResumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => navigate(`/my-resumes`)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-all group"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                    {resume.fileName}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {resume.targetCompany
                      ? `${resume.targetCompany} • ${resume.targetRole || 'Software Role'}`
                      : 'General Tech Placement Evaluation'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {resume.overallScore !== null ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-400">
                        {resume.overallScore}/100
                      </span>
                      <span className="block text-[9px] text-slate-500 uppercase">Score</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/30">
                      Pending
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
                </div>
              </div>
            ))}

            {recentResumes.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs">
                No resumes analyzed yet.{' '}
                <button
                  onClick={() => navigate('/resume-analyzer')}
                  className="text-teal-400 underline font-semibold"
                >
                  Analyze your first resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Placement Preparation Roadmap Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Targeting Top Tech Companies (Google, Micron, Oracle, TCS)?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Check out our curated CS fundamentals, DSA roadmaps, and HR interview guides.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/resources')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all shrink-0"
        >
          Explore Resources
        </button>
      </div>
    </div>
  );
};
