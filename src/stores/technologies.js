// src/stores/technologies.js
import { defineStore } from 'pinia';
import technologiesService from '@/services/technologiesService';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ Import Role Handler

export const useTechnologiesStore = defineStore('technologies', {
  state: () => ({
    technologies: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeTechnologies: (state) => state.technologies.filter(t => t.isActive),
    technologiesByCategory: (state) => (category) => {
      return state.technologies.filter(t => t.category === category);
    },
  },

  actions: {
    async fetchTechnologies() {
      this.loading = true;
      this.error = null;
      try {
        this.technologies = await technologiesService.getAll();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching technologies:', error);
      } finally {
        this.loading = false;
      }
    },

    // Admin Only
    async createTechnology(data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('add')) throw new Error('GUEST_ACTION_BLOCKED');

      this.loading = true;
      this.error = null;
      try {
        const newTechnology = await technologiesService.create(data);
        if (newTechnology && newTechnology.id) {
            this.technologies.push(newTechnology);
        } else {
            await this.fetchTechnologies();
        }
        return newTechnology;
      } catch (error) {
        this.error = error.message;
        console.error('Error creating technology:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin Only
    async updateTechnology(id, data) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('edit')) throw new Error('GUEST_ACTION_BLOCKED');

      this.loading = true;
      this.error = null;
      try {
        const updated = await technologiesService.update(id, data);
        const index = this.technologies.findIndex(t => t.id === id);
        if (index !== -1) this.technologies[index] = updated;
        return updated;
      } catch (error) {
        this.error = error.message;
        console.error('Error updating technology:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin Only
    async deleteTechnology(id) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('delete')) throw new Error('GUEST_ACTION_BLOCKED');

      this.loading = true;
      this.error = null;
      try {
        await technologiesService.delete(id);
        this.technologies = this.technologies.filter(t => t.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('Error deleting technology:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin Only
    async toggleActive(id) {
      // ✅ Standardized Guest Check
      if (handleGuestAction('toggle')) throw new Error('GUEST_ACTION_BLOCKED');

      this.loading = true;
      this.error = null;
      try {
        await technologiesService.toggleActive(id);
        const tech = this.technologies.find(t => t.id === id);
        if (tech) tech.isActive = !tech.isActive;
      } catch (error) {
        this.error = error.message;
        console.error('Error toggling active technology:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  }
});
