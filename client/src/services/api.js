import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, // 60 seconds (useful for AI reasoning / OCR)
});

// Attach JWT token to all requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('placementor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('placementor_token');
        localStorage.removeItem('placementor_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
