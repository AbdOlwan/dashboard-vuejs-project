// src/plugins/axios.js
import axios from 'axios';
import router from '@/router';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7224/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor - إضافة Token تلقائياً
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - معالجة الأخطاء المركزية
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly from ApiResponse<T>
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data, config } = error.response;

      // التحقق مما إذا كان الرابط هو رابط تسجيل الدخول
      // هذا يمنع التوجيه الإجباري عند فشل تسجيل الدخول (كلمة مرور خطأ)
      const isLoginRequest = config.url.includes('/login') || config.url.includes('Auth/login');

      switch (status) {
        case 401:
          // Unauthorized
          if (!isLoginRequest) {
            // إذا لم يكن طلب تسجيل دخول، فهذا يعني أن الجلسة انتهت
            // نقوم بمسح البيانات وتوجيه المستخدم لصفحة الدخول
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            router.push('/login');
          }
          // إذا كان طلب تسجيل دخول، لن نفعل شيئاً هنا
          // وسينتقل الخطأ إلى الـ Catch في ملف auth.js لعرض رسالة الخطأ
          break;

        case 403:
          console.error('Forbidden:', data.message);
          break;

        case 404:
          console.error('Not Found:', data.message);
          break;

        case 422:
          // Validation errors
          console.error('Validation Error:', data.errors);
          break;

        case 500:
          console.error('Server Error:', data.message);
          break;

        default:
          console.error('Error:', data.message);
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
