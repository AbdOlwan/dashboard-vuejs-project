// src/stores/technologies.js
import { defineStore } from 'pinia';
import technologiesService from '@/services/technologiesService';

export const useTechnologiesStore = defineStore('technologies', {
  state: () => ({
    technologies: [],
    loading: false,
    error: null,
  }),

  getters: {
    // جلب التقنيات النشطة فقط (مفيد للموقع العام)
    activeTechnologies: (state) => state.technologies.filter(t => t.isActive),

    // جلب التقنيات حسب الفئة
    technologiesByCategory: (state) => (category) => {
      return state.technologies.filter(t => t.category === category);
    },
  },

  actions: {
    /**
     * جلب جميع التقنيات (للوحة التحكم)
     */
    async fetchTechnologies() {
      this.loading = true;
      this.error = null;
      try {
        //  getAll() موجودة في baseService وتعمل مع technologiesService
        this.technologies = await technologiesService.getAll();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching technologies:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * إنشاء تقنية جديدة
     */
/**
     * إنشاء تقنية جديدة
     */
    async createTechnology(data) {
      this.loading = true;
      this.error = null;
      try {
        const newTechnology = await technologiesService.create(data);

        // إصلاح: التأكد من أن الاستجابة صالحة قبل إضافتها للقائمة المحلية
        // في بعض الأحيان الـ Create يعيد رسالة نجاح فقط ولا يعيد الكائن
        if (newTechnology && newTechnology.id) {
            this.technologies.push(newTechnology);
        } else {
            // إذا لم يعد الكائن، نعيد تحميل القائمة بالكامل لضمان صحة البيانات
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

    /**
     * تحديث تقنية
     */
    async updateTechnology(id, data) {
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

    /**
     * حذف تقنية
     */
    async deleteTechnology(id) {
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

    /**
     * تبديل حالة التفعيل
     */
    async toggleActive(id) {
      this.loading = true;
      this.error = null;
      try {
        // ملاحظة: الخدمة toggleActive غير موجودة في technologiesService.js
        // ولكن الكنترولر يدعمها. سنفترض أنك ستضيفها للخدمة.
        // إذا لم تكن موجودة في baseService, أضفها في technologiesService.js
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
