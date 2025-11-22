// src/stores/testimonials.js
import { defineStore } from 'pinia';
import testimonialsService from '@/services/testimonialsService';

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

    async createTestimonial(data) {
      const newTest = await testimonialsService.create(data);
      this.testimonials.push(newTest);
      return newTest;
    },

    async updateTestimonial(id, data) {
      const updated = await testimonialsService.update(id, data);
      const index = this.testimonials.findIndex(t => t.id === id);
      if (index !== -1) this.testimonials[index] = updated;
      return updated;
    },

    async approveTestimonial(id) {
      await testimonialsService.approve(id);
      const test = this.testimonials.find(t => t.id === id);
      if (test) test.isApproved = true;
    },

    async rejectTestimonial(id) {
      await testimonialsService.reject(id);
      const test = this.testimonials.find(t => t.id === id);
      if (test) test.isApproved = false;
    },

    async deleteTestimonial(id) {
      await testimonialsService.delete(id);
      this.testimonials = this.testimonials.filter(t => t.id !== id);
    }
  }
});
