// src/stores/contactMessages.js
import { defineStore } from 'pinia';
import contactMessagesService from '@/services/contactMessagesService';

export const useContactMessagesStore = defineStore('contactMessages', {
  state: () => ({
    messages: [],
    unreadCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    unreadMessages: (state) => state.messages.filter(m => !m.isRead),
  },

  actions: {
    async fetchMessages() {
      this.loading = true;
      try {
        this.messages = await contactMessagesService.getAll();
        await this.fetchUnreadCount();
      } catch (error) {
        this.error = error.message;
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
      await contactMessagesService.markAsRead(id);
      const message = this.messages.find(m => m.id === id);
      if (message) message.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    },

    async markAsUnread(id) {
      await contactMessagesService.markAsUnread(id);
      const message = this.messages.find(m => m.id === id);
      if (message) message.isRead = false;
      this.unreadCount += 1;
    },

    async deleteMessage(id) {
      await contactMessagesService.delete(id);
      this.messages = this.messages.filter(m => m.id !== id);
      await this.fetchUnreadCount();
    }
  }
});
