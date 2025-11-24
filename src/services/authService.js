// src/services/authService.js
import axios from '@/plugins/axios';

class AuthService {
  /**
   * تسجيل مستخدم جديد
   */
  async register(userData) {
    try {
      const response = await axios.post('/Auth/register', userData);
      return response.data || response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * تسجيل الدخول
   */
  async login(credentials) {
    try {
      const response = await axios.post('/Auth/login', credentials);
      return response.data || response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * تغيير كلمة المرور
   */
  async changePassword(passwordData) {
    try {
      const response = await axios.post('/Auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * الحصول على بيانات المستخدم الحالي
   */
  async getCurrentUser() {
    try {
      const response = await axios.get('/Auth/me');
      return response.data || response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * تحديث بيانات المستخدم الحالي
   */
  async updateCurrentUser(userData) {
    try {
      const response = await axios.put('/Auth/me', userData);
      return response.data || response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * معالج الأخطاء المركزي
   */
  handleError(error) {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'حدث خطأ',
        errors: error.response.data.errors || [],
        statusCode: error.response.status
      };
    }
    return {
      message: 'خطأ في الاتصال بالخادم',
      errors: [],
      statusCode: 500
    };
  }
}

export default new AuthService();
