// src/services/educationService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class EducationService extends BaseService {
  constructor() {
    super('education');
  }

  // Override getAll to use /admin endpoint
  async getAll() {
    const response = await axios.get(`/${this.endpoint}/admin`);
    return response.data;
  }

  // Override getActive (default endpoint)
  async getActive() {
    const response = await axios.get(`/${this.endpoint}`);
    return response.data;
  }
}

export default new EducationService();
