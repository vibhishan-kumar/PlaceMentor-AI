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
  ArrowRight,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your university email.');
      return;
    }

    const uohRegex = /^[A-Za-z0-9._%+-]+@uohyd\.ac\.in$/i;
    if (!uohRegex.test(email.trim())) {
      toast.error('Please use your University of Hyderabad email address ending with @uohyd.ac.in.');
      return;
    }

    if (!password) {
      toast.error('Please enter your password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 via-teal-950/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 p-0.5 shadow-xl shadow-teal-500/20 mb-4 inline-flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-400">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          PlaceMentor <span className="text-teal-400">AI</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with your University of Hyderabad student account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/80 border border-slate-800/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* University Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="rollnumber@uohyd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-teal-400/80 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Restricted to @uohyd.ac.in domain
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-950 font-semibold text-sm bg-gradient-to-r from-teal-500 to-teal-400 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to PlaceMentor</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              New UoH student?{' '}
              <Link
                to="/register"
                className="text-teal-400 font-semibold hover:text-teal-300 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
