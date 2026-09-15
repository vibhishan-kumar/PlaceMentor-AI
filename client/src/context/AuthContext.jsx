import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('placementor_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('placementor_user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Failed to verify existing session:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  /**
   * Student Login
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('placementor_token', newToken);
      localStorage.setItem('placementor_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return response.data;
    }
  };

  /**
   * Student Registration
   */
  const register = async (registrationData) => {
    const response = await api.post('/auth/register', registrationData);
    if (response.data.success) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('placementor_token', newToken);
      localStorage.setItem('placementor_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return response.data;
    }
  };

  /**
   * Update student profile in context
   */
  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    localStorage.setItem('placementor_user', JSON.stringify({ ...user, ...updatedData }));
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem('placementor_token');
    localStorage.removeItem('placementor_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
