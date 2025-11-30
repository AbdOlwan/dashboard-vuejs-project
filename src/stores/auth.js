// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import authService from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    // التحقق من وجود توكن
    isAuthenticated: (state) => !!state.token,

    // بيانات المستخدم
    currentUser: (state) => state.user,

    // هل المستخدم مدير (Admin)؟
    // يستخدم هذا للتحقق من صلاحيات العرض والتعديل الكاملة
    isAdmin: (state) => state.user?.role === 'Admin',

    // هل المستخدم زائر (Guest)؟
    // يستخدم هذا لعرض الواجهة بوضع القراءة فقط
    isGuest: (state) => state.user?.role === 'Guest',

    // هل يملك صلاحية التعديل؟
    // getter مساعد نستخدمه في الواجهة لإظهار/إخفاء أزرار (الإضافة، التعديل، الحذف)
    canModify: (state) => state.user?.role === 'Admin',
  },

  actions: {
    /**
     * تسجيل الدخول
     */
async login(credentials) {
      try {
        const response = await authService.login(credentials);
        const data = response.data || response;

        if (!data?.token) {
          throw new Error('لم يتم استلام token من الخادم');
        }

        // ✅ التعديل هنا: قراءة البيانات بشكل آمن سواء كانت حروف كبيرة أو صغيرة
        // Backend usually sends 'Role' or 'role'
        const role = data.role || data.Role || 'Guest';
        const id = data.id || data.Id;
        const username = data.username || data.Username;
        const email = data.email || data.Email;
        const token = data.token || data.Token;

        this.token = token;
        // حفظ الدور بشكل موحد (Admin/Guest)
        this.user = { id, username, email, role };

        console.log('👤 Login User Data:', this.user); // للتأكد في الكونسول

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(this.user));

        router.push('/');
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    /**
     * تسجيل دخول كزائر (Guest Login)
     * يقوم باستخدام بيانات حساب الزائر المحفوظة في قاعدة البيانات
     */
    async loginAsGuest() {
      try {
        // هام: يجب أن تطابق هذه البيانات حساب الزائر الذي أنشأته في الباك إند
        const guestCredentials = {
          username: 'Guest', // تأكد أن هذا الاسم موجود في قاعدة البيانات
          password: 'guest123' // تأكد أن هذه كلمة المرور الصحيحة
        };

        // نستخدم دالة الـ login العادية بهذه البيانات
        await this.login(guestCredentials);
        return true;
      } catch (error) {
        console.error('Guest login failed:', error);
        throw error; // نعيد الخطأ ليتم عرضه في الواجهة
      }
    },

    /**
     * تسجيل مستخدم جديد
     */
    async register(userData) {
      try {
        const response = await authService.register(userData);
        return response;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    /**
     * تغيير كلمة المرور
     */
    async changePassword(passwordData) {
      try {
        await authService.changePassword(passwordData);
        return true;
      } catch (error) {
        console.error('Change password failed:', error);
        throw error;
      }
    },

    /**
     * تحديث بيانات المستخدم الحالي
     */
    async updateProfile(userData) {
      try {
        const response = await authService.updateCurrentUser(userData);
        const data = response.data || response;

        // تحديث البيانات المحلية مع الحفاظ على الرول الحالي
        this.user = { ...this.user, ...data };
        localStorage.setItem('user', JSON.stringify(this.user));

        return data;
      } catch (error) {
        console.error('Update profile failed:', error);
        throw error;
      }
    },

    /**
     * جلب بيانات المستخدم الحالي
     */
    async fetchCurrentUser() {
      try {
        const response = await authService.getCurrentUser();
        const data = response.data || response;

        this.user = data;
        localStorage.setItem('user', JSON.stringify(this.user));

        return data;
      } catch (error) {
        console.error('Fetch user failed:', error);
        throw error;
      }
    },

    /**
     * تسجيل الخروج
     */
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login');
    }
  }
});
