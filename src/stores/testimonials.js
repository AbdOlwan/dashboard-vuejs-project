// src/stores/testimonials.js
import { defineStore } from 'pinia';
import testimonialsService from '@/services/testimonialsService';
import { handleGuestAction } from '@/utils/roleHandler';

export const useTestimonialsStore = defineStore('testimonials', {
  state: () => ({
    testimonials: [],
    loading: false,
    error: null,
  }),

  getters: {
    approvedTestimonials: (state) => state.testimonials.filter(t => t.isApproved),
    pendingTestimonials: (state) => state.testimonials.filter(t => !t.isApproved),
  },

  actions: {
    async fetchTestimonials() {
      this.loading = true;
      try {
        this.testimonials = await testimonialsService.getAll();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // ✅ الحل: إرجاع null بدلاً من رمي خطأ
    async createTestimonial(data) {
      if (handleGuestAction('add')) return null; // ✅ إيقاف صامت

      const newTest = await testimonialsService.create(data);
      this.testimonials.push(newTest);
      return newTest;
    },

    async updateTestimonial(id, data) {
      if (handleGuestAction('edit')) return null; // ✅ إيقاف صامت

      const updated = await testimonialsService.update(id, data);
      const index = this.testimonials.findIndex(t => t.id === id);
      if (index !== -1) this.testimonials[index] = updated;
      return updated;
    },

    async approveTestimonial(id) {
      if (handleGuestAction('toggle')) return null; // ✅ إيقاف صامت

      await testimonialsService.approve(id);
      const test = this.testimonials.find(t => t.id === id);
      if (test) test.isApproved = true;
    },

    async rejectTestimonial(id) {
      if (handleGuestAction('toggle')) return null; // ✅ إيقاف صامت

      await testimonialsService.reject(id);
      const test = this.testimonials.find(t => t.id === id);
      if (test) test.isApproved = false;
    },

    async deleteTestimonial(id) {
      if (handleGuestAction('delete')) return null; // ✅ إيقاف صامت

      await testimonialsService.delete(id);
      this.testimonials = this.testimonials.filter(t => t.id !== id);
    },
  }
});
