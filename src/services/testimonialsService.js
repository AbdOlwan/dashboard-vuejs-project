// src/services/testimonialsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class TestimonialsService extends BaseService {
  constructor() {
    super('testimonials');
  }

  async getApproved() {
    const response = await axios.get(`/${this.endpoint}`);
    return response.data;
  }

  async getAll() {
    const response = await axios.get(`/${this.endpoint}/all`);
    return response.data;
  }

  async getPending() {
    const response = await axios.get(`/${this.endpoint}/pending`);
    return response.data;
  }

  async approve(id) {
    const response = await axios.post(`/${this.endpoint}/${id}/approve`);
    return response;
  }

  async reject(id) {
    const response = await axios.post(`/${this.endpoint}/${id}/reject`);
    return response;
  }
}

export default new TestimonialsService();
