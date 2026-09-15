import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import { Modal } from '../components/common/Modal';
import {
  FileText,
  Trash2,
  Eye,
  Plus,
  ArrowRightLeft,
  Award,
  FileCheck,
  Calendar,
  Building,
  Briefcase,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResumeDetails, setSelectedResumeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  // Comparison state
  const [compareList, setCompareList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes');
      if (res.data.success) {
        setResumes(res.data.resumes);
      }
    } catch (err) {
      toast.error('Failed to load your resume history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleViewAnalysis = async (resumeId) => {
    try {
      setLoadingDetails(true);
      const res = await api.get(`/resumes/${resumeId}`);
      if (res.data.success) {
        setSelectedResumeDetails(res.data.resume);
      }
    } catch (err) {
      toast.error('Failed to load resume details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    try {
      const res = await api.delete(`/resumes/${resumeToDelete.id}`);
      if (res.data.success) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
        setCompareList((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
        toast.success('Resume deleted successfully.');
        setResumeToDelete(null);
      }
    } catch (err) {
      toast.error('Failed to delete resume.');
    }
  };

  const toggleCompare = (resume) => {
    if (compareList.some((r) => r.id === resume.id)) {
      setCompareList((prev) => prev.filter((r) => r.id !== resume.id));
    } else {
      if (compareList.length >= 2) {
        toast.warning('You can compare a maximum of 2 resumes at a time.');
        return;
      }
      setCompareList((prev) => [...prev, resume]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Resume History & Versions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your ATS scores across versions and compare improvements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length === 2 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 shadow-md hover:brightness-110 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Compare Selected (2)
            </button>
          )}

          <button
            onClick={() => navigate('/resume-analyzer')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload New Resume
          </button>
        </div>
      </div>

      {/* Resumes Grid / Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No resumes uploaded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload your resume to get deep placement insights, ATS score ratings, and company-specific role matching.
          </p>
          <button
            onClick={() => navigate('/resume-analyzer')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 hover:brightness-110 transition-all"
          >
            Upload Resume Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => {
            const isCompared = compareList.some((r) => r.id === resume.id);

            return (
              <div
                key={resume.id}
                className={`relative flex flex-col justify-between p-6 rounded-3xl bg-slate-900/80 border transition-all ${
                  isCompared
                    ? 'border-teal-400 shadow-xl shadow-teal-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate" title={resume.fileName}>
                          {resume.fileName}
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(resume.createdAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setResumeToDelete(resume)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Target Company/Role Badge */}
                  {resume.targetCompany && (
                    <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                      <span className="font-semibold text-teal-400">{resume.targetCompany}</span>
                      {resume.targetRole && <span> • {resume.targetRole}</span>}
                    </div>
                  )}

                  {/* Score Gauges */}
                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80 my-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Overall Score
                      </span>
                      <span className="text-xl font-extrabold text-white">
                        {resume.overallScore !== null ? `${resume.overallScore}/100` : 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        ATS Score
                      </span>
                      <span className="text-xl font-extrabold text-teal-400">
                        {resume.atsScore !== null ? `${resume.atsScore}/100` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewAnalysis(resume.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    View Report
                  </button>

                  <button
                    onClick={() => toggleCompare(resume)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isCompared
                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                        : 'border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {isCompared ? 'Selected' : 'Compare'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Full Analysis Modal */}
      <Modal
        isOpen={Boolean(selectedResumeDetails)}
        onClose={() => setSelectedResumeDetails(null)}
        title={selectedResumeDetails?.fileName || 'Resume Report'}
        maxWidth="max-w-3xl"
      >
        {selectedResumeDetails && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Overall</span>
                <p className="text-2xl font-bold text-white">
                  {selectedResumeDetails.analysis?.overallScore ?? 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">ATS</span>
                <p className="text-2xl font-bold text-teal-400">
                  {selectedResumeDetails.analysis?.atsScore ?? 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Role Fit</span>
                <p className="text-2xl font-bold text-amber-400">
                  {selectedResumeDetails.analysis?.matchPercentage ? `${selectedResumeDetails.analysis.matchPercentage}%` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide mb-1">
                Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedResumeDetails.analysis?.summary || 'No summary generated.'}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-1">
                Key Strengths
              </h4>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                {selectedResumeDetails.analysis?.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-1">
                Weaknesses & ATS Obstacles
              </h4>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                {selectedResumeDetails.analysis?.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Compare Resumes Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Resume Version Comparison"
        maxWidth="max-w-4xl"
      >
        {compareList.length === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compareList.map((res, i) => (
              <div key={res.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-teal-400">
                  Version {i + 1}
                </span>
                <h4 className="text-sm font-bold text-white truncate">{res.fileName}</h4>
                <p className="text-[11px] text-slate-500">Uploaded {formatDate(res.createdAt)}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-900 text-center">
                    <span className="text-[10px] text-slate-400 block">Overall Score</span>
                    <span className="text-lg font-extrabold text-white">{res.overallScore}/100</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 text-center">
                    <span className="text-[10px] text-slate-400 block">ATS Score</span>
                    <span className="text-lg font-extrabold text-teal-400">{res.atsScore}/100</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Target: {res.targetCompany ? `${res.targetCompany} (${res.targetRole || 'Role'})` : 'General Tech'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(resumeToDelete)}
        onClose={() => setResumeToDelete(null)}
        title="Delete Resume Record?"
      >
        <p className="text-xs text-slate-300">
          Are you sure you want to delete <strong className="text-white">"{resumeToDelete?.fileName}"</strong>? This will permanently delete the uploaded document and its analysis.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setResumeToDelete(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};
