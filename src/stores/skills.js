// src/stores/skills.js
import { defineStore } from 'pinia';
import skillsService from '@/services/skillsService';
import { handleGuestAction } from '@/utils/roleHandler'; // ✅ استيراد المعالج

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
      // ✅ التحقق باستخدام handleGuestAction
      if (handleGuestAction('add')) throw new Error('GUEST_ACTION_BLOCKED');

      const newSkill = await skillsService.create(data);
      this.skills.push(newSkill);
      return newSkill;
    },

    async updateSkill(id, data) {
      // ✅ التحقق باستخدام handleGuestAction
      if (handleGuestAction('edit')) throw new Error('GUEST_ACTION_BLOCKED');

      const updated = await skillsService.update(id, data);
      const index = this.skills.findIndex(s => s.id === id);
      if (index !== -1) this.skills[index] = updated;
      return updated;
    },

    async deleteSkill(id) {
      // ✅ التحقق باستخدام handleGuestAction
      if (handleGuestAction('delete')) throw new Error('GUEST_ACTION_BLOCKED');

      await skillsService.delete(id);
      this.skills = this.skills.filter(s => s.id !== id);
    },

    async toggleActive(id) {
      // ✅ التحقق باستخدام handleGuestAction
      if (handleGuestAction('toggle')) throw new Error('GUEST_ACTION_BLOCKED');

      await skillsService.toggleActive(id);
      const skill = this.skills.find(s => s.id === id);
      if (skill) skill.isActive = !skill.isActive;
    },

    async reorderSkills(orderMap) {
      // ✅ التحقق باستخدام handleGuestAction
      if (handleGuestAction('edit')) throw new Error('GUEST_ACTION_BLOCKED');

      await skillsService.reorder(orderMap);
      await this.fetchSkills();
    }
  }
});
