// src/services/certificationsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class CertificationsService extends BaseService {
  constructor() {
    super('certifications');
  }

  // Override getAll to use /all endpoint
  async getAll() {
    const response = await axios.get(`/${this.endpoint}/all`);
    return response.data;
  }
}

export default new CertificationsService();
