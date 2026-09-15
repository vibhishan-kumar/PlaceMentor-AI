import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  FileSearch,
  Code2,
  Database,
  Cloud,
  HelpCircle,
  Calendar,
  CheckCircle2,
  ListPlus,
  Loader2,
  Send,
  Zap
} from 'lucide-react';

export const JobDescriptionAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const toast = useToast();

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 40) {
      toast.error('Please paste a detailed job description (at least 40 characters).');
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysis(null);

      const res = await api.post('/job-description/analyze', {
        jobDescription: jobDescription.trim()
      });

      if (res.data.success) {
        setAnalysis(res.data.analysis);
        toast.success('Job description analyzed successfully!');
      }
    } catch (err) {
      console.error('JD analysis error:', err);
      const msg = err.response?.data?.message || 'Failed to analyze job description.';
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleJDs = [
    {
      title: 'Micron SDE / IT Engineer',
      text: 'Role: Information Technology - Employee Experience Engineering. Requirements: Bachelor/Master in Computer Science, MCA. Strong foundation in Data Structures, Algorithms, Object Oriented Programming. Experience in Java or Python, REST APIs, SQL/PostgreSQL databases, and React or modern web frameworks. Basic knowledge of CI/CD and cloud concepts.'
    },
    {
      title: 'Full Stack Engineer (Campus Placement)',
      text: 'We are looking for Graduate Engineer Trainees in Full Stack Development. Strong knowledge of JavaScript/TypeScript, React.js, Node.js/Express, MongoDB/PostgreSQL. Familiarity with Git, Docker, RESTful APIs, and Unit Testing. Strong analytical and problem-solving skills.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Placement Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Job Description (JD) Analyzer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste any job description from campus circulars or tech portals to decode required tech stacks, interview questions, and a customized preparation roadmap.
        </p>
      </div>

      {/* Input Area */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Paste Job Description Content
            </label>
            <div className="flex gap-2 text-xs">
              <span className="text-slate-500">Quick load:</span>
              {sampleJDs.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJobDescription(s.text)}
                  className="text-teal-400 hover:text-teal-300 underline font-medium"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete job description, eligibility requirements, responsibilities, or role specifications..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all leading-relaxed resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={analyzing || !jobDescription.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-500 to-teal-400 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing Requirements with AI...</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-4 h-4" />
                  <span>Analyze Job Description</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Role Title Banner */}
          <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                Inferred Target Role
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{analysis.roleTitle || 'Software Role'}</h3>
            </div>
            {analysis.experienceRequirements && (
              <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                {analysis.experienceRequirements}
              </span>
            )}
          </div>

          {/* Core Tech Stack Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Languages */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 flex items-center gap-2 uppercase tracking-wide">
                <Code2 className="w-4 h-4" /> Programming Languages
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.programmingLanguages?.map((l, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-teal-300 border border-slate-800 text-xs font-medium">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks & DB */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 flex items-center gap-2 uppercase tracking-wide">
                <Database className="w-4 h-4" /> Frameworks & Databases
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[...(analysis.frameworksAndLibraries || []), ...(analysis.databases || [])].map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 flex items-center gap-2 uppercase tracking-wide">
                <Cloud className="w-4 h-4" /> Cloud & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.cloudAndDevops?.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Required vs Preferred Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-950/40 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Mandatory / Required Skills
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {analysis.requiredSkills?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4" /> Preferred / Good to Have Skills
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {analysis.preferredSkills?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Likely Interview Topics & Questions */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              Likely Interview Rounds & High-Yield Questions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.likelyInterviewTopics?.map((topic, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{topic.topic}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                      {topic.importance} Importance
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                    {topic.sampleQuestions?.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Keywords & Preparation Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keywords */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide flex items-center gap-2">
                <ListPlus className="w-4 h-4" /> Keywords to Embed in Your Resume
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.resumeKeywordsToInclude?.map((k, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-teal-300 border border-teal-500/20 text-xs">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Preparation Roadmap */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Targeted Preparation Roadmap
              </h4>
              <div className="space-y-2.5">
                {analysis.preparationRoadmap?.map((step, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="text-teal-400">{step.week}:</span> {step.focus}
                    </div>
                    <ul className="mt-1 space-y-0.5 text-slate-400 list-disc list-inside">
                      {step.tasks?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
