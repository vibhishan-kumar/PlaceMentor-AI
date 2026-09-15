import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  MessageSquare,
  FileText,
  Briefcase,
  BookOpen,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { label: 'My Resumes', path: '/my-resumes', icon: Briefcase },
    { label: 'JD Analyzer', path: '/jd-analyzer', icon: Sparkles },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/chat') return location.pathname.startsWith('/chat');
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                PlaceMentor <span className="text-teal-400 font-semibold">AI</span>
              </span>
              <span className="block text-[10px] uppercase font-medium tracking-wider text-slate-400 -mt-1">
                UoH Placement Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* Profile Badge (Desktop) */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[10px] text-teal-400 truncate max-w-[120px]">
                  {user?.program || 'UoH Student'}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl text-slate-200 z-50 animate-fadeIn"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {user?.department || 'University of Hyderabad'}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-teal-400" />
                    Student Profile & Settings
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <User className="w-5 h-5 text-teal-400" />
              Student Profile & Settings
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-950/40"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
