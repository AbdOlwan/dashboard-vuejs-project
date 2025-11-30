// src/stores/education.js
import { defineStore } from 'pinia';
import educationService from '@/services/educationService';
import axios from '@/plugins/axios';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import Role Handler

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
        const response = await axios.get('/Education/admin');
        // The controller returns ApiResponse which puts the list inside 'data'
        this.education = response.data || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Admin Only
    async createEducation(data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('add')) throw new Error('GUEST_ACTION_BLOCKED');

      const response = await educationService.create(data);
      const newEdu = response.data || response;

      this.education.push(newEdu);
      return newEdu;
    },

    // Admin Only
    async updateEducation(id, data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('edit')) throw new Error('GUEST_ACTION_BLOCKED');

      const response = await educationService.update(id, data);
      const updated = response.data || response;

      const index = this.education.findIndex(e => e.id === id);
      if (index !== -1) this.education[index] = updated;
      return updated;
    },

    // Admin Only
    async deleteEducation(id) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('delete')) throw new Error('GUEST_ACTION_BLOCKED');

      await educationService.delete(id);
      this.education = this.education.filter(e => e.id !== id);
    }
  }
});
