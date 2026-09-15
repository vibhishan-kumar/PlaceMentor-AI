import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Building,
  Briefcase,
  AlignLeft,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ResumeUploader = ({ onUploadAndAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF, JPG, JPEG or PNG resume.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setFile(selectedFile);

    // Create image preview if applicable
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a resume file to analyze.');
      return;
    }

    onUploadAndAnalyze({
      file,
      targetCompany: targetCompany.trim(),
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim(),
      onProgress: (progress) => setUploadProgress(progress)
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-teal-400 bg-teal-950/20'
            : file
            ? 'border-teal-500/50 bg-slate-900/60'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Click to upload or drag & drop your resume
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, JPG, JPEG, and PNG (Up to 10MB)
              </p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300">
              Auto PDF text parsing & Tesseract OCR image support
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-700">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Resume preview"
                  className="w-12 h-14 object-cover rounded-lg border border-slate-700"
                />
              ) : (
                <div className="w-12 h-14 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatFileSize(file.size)} • {file.type || 'Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Change
              </button>
              <button
                type="button"
                onClick={removeFile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Uploading & parsing resume...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Optional Company & Role Alignment Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal-400" />
            Target Role & Company Alignment (Optional)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Provide a company name and job description to get a company-specific match score, missing keywords, and interview advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Company
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Micron, Oracle, Google, Deloitte"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Job Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. IT - Employee Experience Engineering"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Job Description (JD) Snippet
          </label>
          <textarea
            rows={3}
            placeholder="Paste key responsibilities or requirements from the campus placement notification or job portal..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Analyze Button */}
      <button
        type="submit"
        disabled={!file || isAnalyzing}
        className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
          !file || isAnalyzing
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-600 to-teal-500 text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-105 active:scale-[0.99]'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing Resume with PlaceMentor AI...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Run Complete Resume & ATS Analysis</span>
          </>
        )}
      </button>
    </form>
  );
};
