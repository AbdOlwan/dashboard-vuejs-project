// src/stores/certifications.js
import { defineStore } from 'pinia';
import certificationsService from '@/services/certificationsService';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import Role Handler

export const useCertificationsStore = defineStore('certifications', {
  state: () => ({
    certifications: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCertifications: (state) => state.certifications.filter(c => c.isActive),
    expiredCertifications: (state) => {
      const now = new Date();
      return state.certifications.filter(c => c.expiryDate && new Date(c.expiryDate) < now);
    }
  },

  actions: {
    async fetchCertifications() {
      this.loading = true;
      this.error = null;
      try {
        const data = await certificationsService.getAll();

        if (Array.isArray(data)) {
          this.certifications = data;
        } else {
          console.error('Data format error: expected array', data);
          this.certifications = [];
        }
      } catch (error) {
        this.error = error.message || 'حدث خطأ أثناء تحميل البيانات';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createCertification(data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('add')) throw new Error('GUEST_ACTION_BLOCKED');

      const newCert = await certificationsService.create(data);
      const addedCert = newCert.data || newCert;
      this.certifications.push(addedCert);
      return addedCert;
    },

    async updateCertification(id, data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('edit')) throw new Error('GUEST_ACTION_BLOCKED');

      const updatedResponse = await certificationsService.update(id, data);
      const updatedCert = updatedResponse.data || updatedResponse;

      const index = this.certifications.findIndex(c => c.id == id);
      if (index !== -1) {
        this.certifications[index] = { ...this.certifications[index], ...updatedCert };
      }
      return updatedCert;
    },

    async deleteCertification(id) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('delete')) throw new Error('GUEST_ACTION_BLOCKED');

      await certificationsService.delete(id);
      this.certifications = this.certifications.filter(c => c.id !== id);
    },

    async toggleActive(id) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('toggle')) throw new Error('GUEST_ACTION_BLOCKED');

      await certificationsService.toggleActive(id);
      const cert = this.certifications.find(c => c.id === id);
      if (cert) cert.isActive = !cert.isActive;
    }
  }
});
