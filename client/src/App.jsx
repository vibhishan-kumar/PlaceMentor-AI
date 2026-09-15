import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ChatPage } from './pages/ChatPage';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { MyResumes } from './pages/MyResumes';
import { JobDescriptionAnalyzer } from './pages/JobDescriptionAnalyzer';
import { PlacementResources } from './pages/PlacementResources';
import { ProfileSettings } from './pages/ProfileSettings';

// App Layout with sticky Navbar
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                  <Route path="/my-resumes" element={<MyResumes />} />
                  <Route path="/jd-analyzer" element={<JobDescriptionAnalyzer />} />
                  <Route path="/resources" element={<PlacementResources />} />
                  <Route path="/profile" element={<ProfileSettings />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
