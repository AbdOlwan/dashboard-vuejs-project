// src/services/projectsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class ProjectsService extends BaseService {
  constructor() {
    super('projects');
  }

  // Custom methods specific to Projects
  async getFeatured() {
    const response = await axios.get(`/${this.endpoint}/featured`);
    return response.data;
  }

  async getByType(projectType) {
    const response = await axios.get(`/${this.endpoint}/type/${projectType}`);
    return response.data;
  }

  async toggleFeatured(id) {
    const response = await axios.patch(`/${this.endpoint}/${id}/toggle-featured`);
    return response;
  }

  async addImages(projectId, images) {
    const response = await axios.post(`/${this.endpoint}/${projectId}/images`, images);
    return response;
  }

  async removeImage(imageId) {
    const response = await axios.delete(`/${this.endpoint}/images/${imageId}`);
    return response;
  }
}

export default new ProjectsService();
















