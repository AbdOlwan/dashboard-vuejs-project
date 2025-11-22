// src/stores/skills.js
import { defineStore } from 'pinia';
import skillsService from '@/services/skillsService';

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [],
    loading: false,
    error: null,
  }),

  getters: {
    skillsByCategory: (state) => (category) => {
      return state.skills.filter(s => s.category === category);
    },
    activeSkills: (state) => state.skills.filter(s => s.isActive),
  },

  actions: {
    async fetchSkills() {
      this.loading = true;
      try {
        this.skills = await skillsService.getAll();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createSkill(data) {
      const newSkill = await skillsService.create(data);
      this.skills.push(newSkill);
      return newSkill;
    },

    async updateSkill(id, data) {
      const updated = await skillsService.update(id, data);
      const index = this.skills.findIndex(s => s.id === id);
      if (index !== -1) this.skills[index] = updated;
      return updated;
    },

    async deleteSkill(id) {
      await skillsService.delete(id);
      this.skills = this.skills.filter(s => s.id !== id);
    },

    async toggleActive(id) {
      await skillsService.toggleActive(id);
      const skill = this.skills.find(s => s.id === id);
      if (skill) skill.isActive = !skill.isActive;
    },

    async reorderSkills(orderMap) {
      await skillsService.reorder(orderMap);
      await this.fetchSkills();
    }
  }
});

// ==========================================



// ==========================================



// ==========================================



// ==========================================



// ==========================================


