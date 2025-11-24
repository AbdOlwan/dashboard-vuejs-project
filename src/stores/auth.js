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
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
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

        const { token, username, email, id } = data;

        this.token = token;
        this.user = { id, username, email };

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(this.user));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        router.push('/');
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
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

        // تحديث البيانات المحلية
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
