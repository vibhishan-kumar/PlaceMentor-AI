import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Building,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Loader2,
  Briefcase
} from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    program: '',
    department: '',
    graduationYear: 2025,
    skills: '',
    preferredDomain: 'Software Development',
    experienceLevel: 'Fresher'
  });

  const [aiStatus, setAiStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile');
        if (res.data.success) {
          const p = res.data.profile;
          setFormData({
            name: p.name || '',
            phone: p.phone || '',
            program: p.program || '',
            department: p.department || '',
            graduationYear: p.graduationYear || 2025,
            skills: p.skills || '',
            preferredDomain: p.preferredDomain || 'Software Development',
            experienceLevel: p.experienceLevel || 'Fresher'
          });
          setAiStatus(p.aiStatus);
        }
      } catch (err) {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.patch('/profile', {
        ...formData,
        graduationYear: parseInt(formData.graduationYear, 10)
      });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Student Profile & AI Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your university placement profile and view active AI provider status.
        </p>
      </div>

      {/* AI Provider Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-500/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active AI Engine Architecture</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current model: <span className="text-teal-400 font-mono">{aiStatus?.model || 'Configured in .env'}</span>
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              aiStatus?.isConfigured
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}
          >
            {aiStatus?.isConfigured ? 'Connected' : 'Key Needed in .env'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-1">
          PlaceMentor AI uses an abstraction layer supporting <strong>Google Gemini</strong> and <strong>Groq/Llama</strong>. To switch providers, update <code className="text-teal-300 font-mono bg-slate-950 px-1 py-0.5 rounded">AI_PROVIDER=groq</code> or <code className="text-teal-300 font-mono bg-slate-950 px-1 py-0.5 rounded">AI_PROVIDER=gemini</code> in your server's <code className="text-teal-300 font-mono bg-slate-950 px-1 py-0.5 rounded">.env</code>.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Readonly University Email Badge */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              University of Hyderabad Email (Immutable)
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-teal-500" />
              <span className="font-mono">{user?.email}</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                Verified UoH Student
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree / Program
              </label>
              <input
                type="text"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department / School
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Graduation Year
              </label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
              >
                <option value="Fresher">Fresher</option>
                <option value="Internship Experienced">Internship Experienced</option>
                <option value="Prior Work Experience">Prior Work Experience</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skills (Comma Separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Java, Python, React, DSA, PostgreSQL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Preferred Placement Domain
            </label>
            <select
              name="preferredDomain"
              value={formData.preferredDomain}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
            >
              <option value="Software Development">Software Development / SDE</option>
              <option value="Frontend Development">Frontend / UI Engineering</option>
              <option value="Backend Development">Backend / API Engineering</option>
              <option value="Full Stack Development">Full Stack Web Development</option>
              <option value="AI / Machine Learning">AI / Machine Learning / Data Science</option>
              <option value="Cloud & DevOps">Cloud & DevOps Engineering</option>
              <option value="Cybersecurity">Cybersecurity & Networks</option>
              <option value="Quality Assurance">QA & Automation Testing</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-teal-500 to-teal-400 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
