// src/plugins/axios.js
import axios from 'axios';
import router from '@/router';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://portfolio-backend.runasp.net/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// =========================================================
// Request Interceptor: Attach token to every request
// =========================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ FIX: Log request details for debugging
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (token) {
      console.log('🔐 Token attached:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No auth token found for request');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// =========================================================
// Response Interceptor: Handle errors and extract data
// =========================================================
axiosInstance.interceptors.response.use(
  (response) => {
    // ✅ Log successful responses
    console.log(`✅ API Response: ${response.config.url}`, response.data);

    // Return data directly for easier handling
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      console.error(`❌ API Error ${status}:`, config.url, data);

      // Check if this is a login request
      const isLoginRequest = config.url?.includes('/login') || config.url?.includes('Auth/login');
      const isRegisterRequest = config.url?.includes('/register') || config.url?.includes('Auth/register');

      switch (status) {
        case 401:
          // Only redirect if NOT a login/register attempt
          if (!isLoginRequest && !isRegisterRequest) {
            console.error('🔒 Session Expired or Invalid Token. Redirecting to login...');

            // Clear auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            // Redirect to login
            if (router.currentRoute.value.name !== 'Login') {
              router.push('/login');
            }
          }
          break;

        case 403:
          console.error('🚫 Forbidden: You do not have permission to access this resource.');
          break;

        case 422:
          console.error('⚠️ Validation Error:', data.errors);
          break;

        case 500:
          console.error('💥 Server Error:', data.message || data);
          // ✅ Better error message for users
          if (data.message) {
            alert(`خطأ في الخادم: ${data.message}`);
          }
          break;

        default:
          console.error(`❓ Error (${status}):`, data.message || data);
      }
    } else if (error.request) {
      console.error('🌐 Network Error: No response received from server.');
      alert('خطأ في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.');
    } else {
      console.error('⚠️ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
