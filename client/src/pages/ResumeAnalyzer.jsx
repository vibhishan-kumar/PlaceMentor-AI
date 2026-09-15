import React, { useState } from 'react';
import { ResumeUploader } from '../components/resume/ResumeUploader';
import { ScoreCard } from '../components/resume/ScoreCard';
import { RoleMatchCard } from '../components/resume/RoleMatchCard';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Code2,
  FolderGit2,
  GraduationCap,
  Lightbulb,
  Check,
  RotateCcw
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeResumeMeta, setActiveResumeMeta] = useState(null);

  const toast = useToast();

  const handleUploadAndAnalyze = async ({
    file,
    targetCompany,
    targetRole,
    jobDescription,
    onProgress
  }) => {
    try {
      setAnalyzing(true);
      setAnalysisResult(null);

      // 1. Upload File
      const formData = new FormData();
      formData.append('resume', file);
      if (targetCompany) formData.append('targetCompany', targetCompany);
      if (targetRole) formData.append('targetRole', targetRole);
      if (jobDescription) formData.append('jobDescription', jobDescription);

      const uploadRes = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        }
      });

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || 'Upload failed');
      }

      const uploadedResume = uploadRes.data.resume;
      setActiveResumeMeta(uploadedResume);

      // 2. Trigger AI Analysis
      const analyzeRes = await api.post(`/resumes/${uploadedResume.id}/analyze`, {
        targetCompany,
        targetRole,
        jobDescription
      });

      if (analyzeRes.data.success) {
        const result = analyzeRes.data.analysis;
        setAnalysisResult(result);
        toast.success('Resume analysis generated successfully!');

        // Trigger celebratory confetti if score is high
        if (result.overallScore >= 75) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }
    } catch (error) {
      console.error('Resume evaluation error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to analyze resume. Please try again.';
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveResumeMeta(null);
    setActiveTab('overview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Placement Evaluator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Resume & ATS Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Get instant feedback on ATS parseability, technical depth, and company-specific role alignment.
          </p>
        </div>

        {analysisResult && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Analyze Another Resume
          </button>
        )}
      </div>

      {/* Upload Zone (Visible when no result yet) */}
      {!analysisResult && (
        <div className="max-w-3xl mx-auto">
          <ResumeUploader
            onUploadAndAnalyze={handleUploadAndAnalyze}
            isAnalyzing={analyzing}
          />
        </div>
      )}

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ScoreCard
              title="Overall Placement Score"
              score={analysisResult.overallScore}
              subtitle="Holistic rating for campus tech drives"
              icon={Award}
              badge="Readiness"
            />
            <ScoreCard
              title="ATS Compatibility Score"
              score={analysisResult.atsScore}
              subtitle="Parsing reliability & keyword density"
              icon={FileCheck}
              badge="ATS Engine"
            />
            {analysisResult.companyRoleAnalysis ? (
              <ScoreCard
                title="Target Role Match"
                score={analysisResult.matchPercentage ?? 80}
                subtitle={`${activeResumeMeta?.targetCompany || 'Target Company'} Alignment`}
                icon={TrendingUp}
                badge="Role Fit"
              />
            ) : (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
                <span className="text-xs uppercase font-semibold text-slate-400">Target Role Match</span>
                <p className="text-xs text-slate-400 mt-2">
                  No specific company was selected. General software engineering benchmark was applied.
                </p>
              </div>
            )}
          </div>

          {/* Company & Role Alignment Highlight Card (if provided) */}
          {analysisResult.companyRoleAnalysis && (
            <RoleMatchCard
              matchData={analysisResult.companyRoleAnalysis}
              targetCompany={activeResumeMeta?.targetCompany}
              targetRole={activeResumeMeta?.targetRole}
            />
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 overflow-x-auto gap-2 pb-px">
            {[
              { id: 'overview', label: 'Executive Summary' },
              { id: 'strengths', label: 'Strengths & Weaknesses' },
              { id: 'skills', label: 'Skills & Tech Stack' },
              { id: 'projects', label: 'Projects & Experience' },
              { id: 'formatting', label: 'ATS & Formatting Issues' },
              { id: 'improvements', label: 'Rewritten Bullet Suggestions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap rounded-t-xl border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-teal-400 bg-teal-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="space-y-6">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                  Executive Assessment
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {analysisResult.summary || 'Comprehensive evaluation completed.'}
                </p>

                {/* High Priority Suggestions */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Top Actionable Suggestions for High Impact:
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.actionableSuggestions?.map((sugg, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{sugg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Strengths & Weaknesses */}
            {activeTab === 'strengths' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-950/40 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Resume Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.strengths?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-950/40 space-y-4">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Weaknesses / Missing Elements
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.weaknesses?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Skills Analysis */}
            {activeTab === 'skills' && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    Identified Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.skillsAnalysis?.existingSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    Recommended Industry Skills to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.skillsAnalysis?.missingSkills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/30 text-xs font-medium"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Projects & Experience */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-teal-400" />
                    Project Descriptions & Technical Depth
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-200 block">Quality:</span>
                      <p className="mt-0.5">{analysisResult.projectAnalysis?.quality || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Technical Depth:</span>
                      <p className="mt-0.5">{analysisResult.projectAnalysis?.technicalDepth || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Suggestions:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {analysisResult.projectAnalysis?.suggestedImprovements?.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    Education & Experience Analysis
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-200 block">Education Section:</span>
                      <p className="mt-0.5">{analysisResult.educationAnalysis || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Experience / Internship Portfolio:</span>
                      <p className="mt-0.5">{analysisResult.experienceAnalysis || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. ATS & Formatting */}
            {activeTab === 'formatting' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    ATS Issues Detected
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.atsIssues?.length > 0 ? (
                      analysisResult.atsIssues.map((issue, idx) => (
                        <li key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          {issue}
                        </li>
                      ))
                    ) : (
                      <li className="text-emerald-400">No major ATS parsing obstacles detected!</li>
                    )}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-400" />
                    Formatting & Visual Structure
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysisResult.formattingIssues?.map((fmt, idx) => (
                      <li key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        {fmt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 6. Improved Resume Suggestions */}
            {activeTab === 'improvements' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-xs text-teal-300">
                  PlaceMentor AI re-wrote bullet points from your resume into high-impact, quantifiable statements using the XYZ formula: <em>"Accomplished [X], measured by [Y], by doing [Z]"</em>.
                </div>

                <div className="space-y-3">
                  {analysisResult.improvedResumeSuggestions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide">
                          Original Weak Bullet:
                        </span>
                        <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          {item.originalBullet}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Recommended High-Impact Bullet:
                        </span>
                        <p className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40 font-medium">
                          {item.suggestedBullet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
