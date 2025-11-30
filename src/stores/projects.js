// src/stores/projects.js
import { defineStore } from 'pinia';
import projectsService from '@/services/projectsService';
import { handleGuestAction } from '@/utils/roleHandler';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  getters: {
    featuredProjects: (state) => state.projects.filter(p => p.isFeatured),
    activeProjects: (state) => state.projects.filter(p => p.isActive),
    projectsByType: (state) => (type) => {
      return state.projects.filter(p => p.projectType === type);
    },
    projectsCount: (state) => state.projects.length,
  },

  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        console.log('📄 Fetching all projects...');
        this.projects = await projectsService.getAll();
        console.log('✅ Projects fetched:', this.projects.length);
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error fetching projects:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(id) {
      this.loading = true;
      this.error = null;
      try {
        console.log('📄 Store: Fetching project by ID:', id);
        const project = await projectsService.getById(id);
        console.log('✅ Store: Project fetched successfully:', project);
        this.currentProject = project;
        return project;
      } catch (error) {
        this.error = error.message || 'فشل في تحميل المشروع';
        console.error('❌ Store: Error fetching project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData) {
      // ✅ التحقق من الصلاحية - إذا Guest نعرض رسالة ونتوقف فوراً
      if (handleGuestAction('add')) {
        console.log('🚫 Guest tried to create project - BLOCKED');
        // نرمي خطأ خاص لن نعرضه في UI
        throw new Error('GUEST_ACTION_BLOCKED');
      }

      this.loading = true;
      this.error = null;
      try {
        console.log('📤 Creating new project:', projectData);
        const newProject = await projectsService.create(projectData);
        console.log('✅ Project created:', newProject);

        this.projects.push(newProject);
        return newProject;
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error creating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id, projectData) {
      // ✅ التحقق من الصلاحية
      if (handleGuestAction('edit')) {
        console.log('🚫 Guest tried to update project - BLOCKED');
        throw new Error('GUEST_ACTION_BLOCKED');
      }

      this.loading = true;
      this.error = null;
      try {
        console.log('📤 Updating project:', id, projectData);
        const updatedProject = await projectsService.update(id, projectData);
        console.log('✅ Project updated:', updatedProject);

        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }

        return updatedProject;
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error updating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(id) {
      // ✅ التحقق من الصلاحية
      if (handleGuestAction('delete')) {
        console.log('🚫 Guest tried to delete project - BLOCKED');
        throw new Error('GUEST_ACTION_BLOCKED');
      }

      this.loading = true;
      this.error = null;
      try {
        console.log('🗑️ Deleting project:', id);
        await projectsService.delete(id);
        console.log('✅ Project deleted');

        this.projects = this.projects.filter(p => p.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error deleting project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleActive(id) {
      // ✅ التحقق من الصلاحية
      if (handleGuestAction('toggle')) {
        console.log('🚫 Guest tried to toggle active - BLOCKED');
        throw new Error('GUEST_ACTION_BLOCKED');
      }

      this.loading = true;
      this.error = null;
      try {
        console.log('🔄 Toggling active status:', id);
        await projectsService.toggleActive(id);
        console.log('✅ Active status toggled');

        const project = this.projects.find(p => p.id === id);
        if (project) {
          project.isActive = !project.isActive;
        }
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error toggling active:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleFeatured(id) {
      // ✅ التحقق من الصلاحية
      if (handleGuestAction('toggle')) {
        console.log('🚫 Guest tried to toggle featured - BLOCKED');
        throw new Error('GUEST_ACTION_BLOCKED');
      }

      this.loading = true;
      this.error = null;
      try {
        console.log('🔄 Toggling featured status:', id);
        await projectsService.toggleFeatured(id);
        console.log('✅ Featured status toggled');

        const project = this.projects.find(p => p.id === id);
        if (project) {
          project.isFeatured = !project.isFeatured;
        }
      } catch (error) {
        this.error = error.message;
        console.error('❌ Error toggling featured:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentProject() {
      this.currentProject = null;
    },

    clearError() {
      this.error = null;
    }
  }
});
