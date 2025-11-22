// src/stores/certifications.js
import { defineStore } from 'pinia';
import certificationsService from '@/services/certificationsService';

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
      try {
        this.certifications = await certificationsService.getAll();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createCertification(data) {
      const newCert = await certificationsService.create(data);
      this.certifications.push(newCert);
      return newCert;
    },

    async updateCertification(id, data) {
      const updated = await certificationsService.update(id, data);
      const index = this.certifications.findIndex(c => c.id === id);
      if (index !== -1) this.certifications[index] = updated;
      return updated;
    },

    async deleteCertification(id) {
      await certificationsService.delete(id);
      this.certifications = this.certifications.filter(c => c.id !== id);
    },

    async toggleActive(id) {
      await certificationsService.toggleActive(id);
      const cert = this.certifications.find(c => c.id === id);
      if (cert) cert.isActive = !cert.isActive;
    }
  }
});
