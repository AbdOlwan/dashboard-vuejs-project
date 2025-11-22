// src/stores/education.js
import { defineStore } from 'pinia';
import educationService from '@/services/educationService';

export const useEducationStore = defineStore('education', {
  state: () => ({
    education: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchEducation() {
      this.loading = true;
      try {
        this.education = await educationService.getAll();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createEducation(data) {
      const newEdu = await educationService.create(data);
      this.education.push(newEdu);
      return newEdu;
    },

    async updateEducation(id, data) {
      const updated = await educationService.update(id, data);
      const index = this.education.findIndex(e => e.id === id);
      if (index !== -1) this.education[index] = updated;
      return updated;
    },

    async deleteEducation(id) {
      await educationService.delete(id);
      this.education = this.education.filter(e => e.id !== id);
    }
  }
});
