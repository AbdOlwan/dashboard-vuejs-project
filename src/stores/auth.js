// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import router from '@/router'; // سنحتاجه للتوجيه بعد الدخول

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null, // حفظ بيانات المستخدم لتبقى بعد التحديث
        token: localStorage.getItem('auth_token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials) {
            try {
                // Post request to /auth/login based on AuthController.cs
                const response = await axios.post('/Auth/login', credentials);

                // The response structure based on BaseApiController is ApiResponse<T>
                // response.data.data contains the AdminUserLoginResponseDto
// استخراج البيانات بشكل آمن يعمل مع أي هيكل
const data = response.data?.data || response.data;

if (!data?.token) {
    throw new Error('لم يتم استلام token من الخادم');
}

const { token, username, email, id } = data;

                // Update State
                this.token = token;
                this.user = { id, username, email };

                // Save to LocalStorage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(this.user));

                // Set Axios Header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Redirect to Dashboard
                router.push('/');

                return true;
            } catch (error) {
                console.error('Login failed:', error);
                throw error; // نمرر الخطأ للـ Component ليعرض رسالة
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});
