// src/stores/experiences.js
import { defineStore } from 'pinia';
import experiencesService from '@/services/experiencesService';

export const useExperiencesStore = defineStore('experiences', {
  state: () => ({
    experiences: [],
    loading: false,
    error: null,
  }),

  getters: {
    // ترتيب الخبرات من الأحدث للأقدم
    sortedExperiences: (state) => {
      return [...state.experiences].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    },
    currentExperiences: (state) => {
      return state.experiences.filter(e => e.isCurrentJob);
    },
    pastExperiences: (state) => {
      return state.experiences.filter(e => !e.isCurrentJob);
    },
  },

  actions: {
    async fetchExperiences() {
      this.loading = true;
      this.error = null;
      try {
        const response = await experiencesService.getAll();
        // التعامل مع هيكلية الاستجابة ApiResponse
        this.experiences = response.data || response;
      } catch (error) {
        this.error = error.message || 'حدث خطأ أثناء جلب البيانات';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getExperienceById(id) {
      // محاولة العثور عليه في القائمة الحالية أولاً
      const existing = this.experiences.find(e => e.id === parseInt(id));
      if (existing) return existing;

      // إذا لم يوجد، جلبه من السيرفر
      try {
        const response = await experiencesService.getById(id);
        return response.data || response;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async createExperience(data) {
      this.loading = true;
      try {
        const response = await experiencesService.create(data);
        const newExp = response.data || response;
        this.experiences.push(newExp);
        return newExp;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateExperience(id, data) {
      this.loading = true;
      try {
        const response = await experiencesService.update(id, data);
        const updated = response.data || response;
        const index = this.experiences.findIndex(e => e.id === parseInt(id));
        if (index !== -1) this.experiences[index] = updated;
        return updated;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteExperience(id) {
      try {
        await experiencesService.delete(id);
        this.experiences = this.experiences.filter(e => e.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    }
  }
});
