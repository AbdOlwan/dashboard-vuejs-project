// src/stores/contactMessages.js
import { defineStore } from 'pinia';
import contactMessagesService from '@/services/contactMessagesService';
import { useAuthStore } from '@/stores/auth';

export const useContactMessagesStore = defineStore('contactMessages', {
  state: () => ({
    messages: [],
    unreadCount: 0,
    loading: false,
    processingId: null, // ✅ أضفنا هذا المتغير لحالة أزرار التحميل
    error: null,
  }),

  getters: {
    // ✅ أضفنا هذا الجيتر لأنه مستخدم في العرض
    filteredMessages: (state) => {
        // ترتيب الرسائل من الأحدث للأقدم
        return [...state.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    unreadMessages: (state) => state.messages.filter(m => !m.isRead),
  },

  actions: {
    async fetchMessages() {
      this.loading = true;
      try {
        // تأكد من أن الباك إند يرجع مصفوفة
        const response = await contactMessagesService.getAll();
        this.messages = Array.isArray(response) ? response : (response.data || []);
        await this.fetchUnreadCount();
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching messages:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        this.unreadCount = await contactMessagesService.getUnreadCount();
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    },

    async markAsRead(id) {
      const authStore = useAuthStore();
      if (!authStore.isAdmin) return;

      this.processingId = id; // ✅ تفعيل التحميل للزر
      try {
        await contactMessagesService.markAsRead(id);
        const message = this.messages.find(m => m.id === id);
        if (message) message.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      } finally {
        this.processingId = null; // ✅ إيقاف التحميل
      }
    },

    async markAsUnread(id) {
      const authStore = useAuthStore();
      if (!authStore.isAdmin) return;

      this.processingId = id;
      try {
        await contactMessagesService.markAsUnread(id);
        const message = this.messages.find(m => m.id === id);
        if (message) message.isRead = false;
        this.unreadCount += 1;
      } finally {
        this.processingId = null;
      }
    },

    async deleteMessage(id) {
      const authStore = useAuthStore();
      if (!authStore.isAdmin) return;

      this.processingId = id;
      try {
        await contactMessagesService.delete(id);
        this.messages = this.messages.filter(m => m.id !== id);
        await this.fetchUnreadCount();
      } finally {
        this.processingId = null;
      }
    }
  }
});
