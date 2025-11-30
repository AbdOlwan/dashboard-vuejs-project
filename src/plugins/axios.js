// src/plugins/axios.js
import axios from 'axios';
import router from '@/router';

// Create axios instance
const axiosInstance = axios.create({
  // تأكد أن هذا الرابط يشير للباك إند الصحيح سواء محلياً أو على السيرفر
  baseURL: import.meta.env.VITE_API_URL || 'https://portfolio-backend.runasp.net/api',
  timeout: 15000, // زيادة الوقت قليلاً لأن السيرفر المجاني قد يكون بطيئاً
  headers: {
    'Content-Type': 'application/json',
  }
});

// =========================================================
// Request Interceptor: إرفاق التوكن مع كل طلب
// =========================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. جلب التوكن من التخزين المحلي
    const token = localStorage.getItem('auth_token');

    // 2. إذا وجد التوكن، قم بإضافته للـ Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // (اختياري) طباعة تحذير في الكونسول للمطور
      // console.warn('Auth: No token found in localStorage for this request.');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// Response Interceptor: معالجة أخطاء التوثيق والشبكة
// =========================================================
axiosInstance.interceptors.response.use(
  (response) => {
    // إرجاع البيانات مباشرة لتسهيل التعامل معها في الـ Components
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      // هل هذا الطلب هو طلب تسجيل دخول أصلاً؟
      const isLoginRequest = config.url.includes('/login') || config.url.includes('Auth/login');

      switch (status) {
        case 401:
          // إذا جاء الخطأ 401 ولم نكن نحاول تسجيل الدخول، فهذا يعني أن الجلسة انتهت
          if (!isLoginRequest) {
            console.error('Session Expired or Invalid Token. Redirecting to login...');

            // تنظيف البيانات القديمة
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            // توجيه المستخدم لصفحة الدخول
            router.push('/login');
          }
          break;

        case 403:
          console.error('Forbidden: You do not have permission to access this resource.');
          break;

        case 422:
          console.error('Validation Error:', data.errors);
          break;

        case 500:
          console.error('Server Error:', data.message);
          break;

        default:
          console.error(`Error (${status}):`, data.message);
      }
    } else if (error.request) {
      console.error('Network Error: No response received from server.');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
