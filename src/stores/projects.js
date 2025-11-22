// src/stores/projects.js
import { defineStore } from 'pinia';
import projectsService from '@/services/projectsService';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Get featured projects
    featuredProjects: (state) => state.projects.filter(p => p.isFeatured),

    // Get active projects
    activeProjects: (state) => state.projects.filter(p => p.isActive),

    // Get projects by type
    projectsByType: (state) => (type) => {
      return state.projects.filter(p => p.projectType === type);
    },

    // Get project count
    projectsCount: (state) => state.projects.length,
  },

  actions: {
    /**
     * Fetch all projects
     */
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        this.projects = await projectsService.getAll();
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching projects:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch project by ID
     */
    async fetchProjectById(id) {
      this.loading = true;
      this.error = null;
      try {
        this.currentProject = await projectsService.getById(id);
        return this.currentProject;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new project
     */
    async createProject(projectData) {
      this.loading = true;
      this.error = null;
      try {
        const newProject = await projectsService.create(projectData);
        this.projects.push(newProject);
        return newProject;
      } catch (error) {
        this.error = error.message;
        console.error('Error creating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update existing project
     */
    async updateProject(id, projectData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedProject = await projectsService.update(id, projectData);

        // Update in local state
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }

        return updatedProject;
      } catch (error) {
        this.error = error.message;
        console.error('Error updating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete project
     */
    async deleteProject(id) {
      this.loading = true;
      this.error = null;
      try {
        await projectsService.delete(id);

        // Remove from local state
        this.projects = this.projects.filter(p => p.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('Error deleting project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Toggle active status
     */
    async toggleActive(id) {
      this.loading = true;
      this.error = null;
      try {
        await projectsService.toggleActive(id);

        // Update in local state
        const project = this.projects.find(p => p.id === id);
        if (project) {
          project.isActive = !project.isActive;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error toggling active:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Toggle featured status
     */
    async toggleFeatured(id) {
      this.loading = true;
      this.error = null;
      try {
        await projectsService.toggleFeatured(id);

        // Update in local state
        const project = this.projects.find(p => p.id === id);
        if (project) {
          project.isFeatured = !project.isFeatured;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error toggling featured:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear current project
     */
    clearCurrentProject() {
      this.currentProject = null;
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    }
  }
});
