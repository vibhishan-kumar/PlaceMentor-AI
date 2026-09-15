import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  BookOpen,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    program: 'MCA',
    department: 'School of Computer and Information Sciences',
    graduationYear: 2025,
    skills: '',
    preferredDomain: 'Software Development',
    experienceLevel: 'Fresher'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uohRegex = /^[A-Za-z0-9._%+-]+@uohyd\.ac\.in$/i;
    if (!uohRegex.test(formData.email.trim())) {
      toast.error('Please use your University of Hyderabad email address ending with @uohyd.ac.in.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await register({
        ...formData,
        email: formData.email.trim(),
        name: formData.name.trim(),
        graduationYear: parseInt(formData.graduationYear, 10)
      });
      toast.success('Registration successful! Welcome to PlaceMentor AI.');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-teal-500/10 via-teal-950/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5 shadow-xl shadow-teal-500/20 mb-3 inline-flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
            <GraduationCap className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Student Account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Exclusive to University of Hyderabad (<span className="text-teal-400">@uohyd.ac.in</span>) students
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-slate-900/80 border border-slate-800/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  University Email (@uohyd.ac.in) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@uohyd.ac.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Phone & Degree/Program */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Degree / Program *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
                  >
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="M.Tech CS">M.Tech (Computer Science)</option>
                    <option value="M.Tech AI">M.Tech (Artificial Intelligence)</option>
                    <option value="M.Tech IT">M.Tech (Information Technology)</option>
                    <option value="Integrated M.Tech CS">Integrated M.Tech (Computer Science)</option>
                    <option value="M.Sc CS">M.Sc (Computer Science)</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="Other">Other University Program</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 4: Department & Graduation Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / School *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="School of Computer & Info Sciences"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Graduation Year *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <select
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-all"
                  >
                    <option value="2024">2024 (Alumni / Immediate)</option>
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2026">2026 (Pre-Final Year)</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 5: Skills & Preferred Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Java, Python, React, DSA, SQL, Spring Boot"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
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
            </div>

            {/* Row 6: Experience Level */}
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
                <option value="Fresher">Fresher (Campus Placement Candidate)</option>
                <option value="Internship Experienced">Internship Experienced (1 or more internships)</option>
                <option value="Prior Work Experience">Prior Work Experience (1-2 years before degree)</option>
              </select>
            </div>

            {/* Register Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-950 font-semibold text-sm bg-gradient-to-r from-teal-500 to-teal-400 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-teal-400 font-semibold hover:text-teal-300 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
