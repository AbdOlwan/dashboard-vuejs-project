// src/services/skillsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class SkillsService extends BaseService {
  constructor() {
    super('skills');
  }

  async getByCategory(category) {
    const response = await axios.get(`/${this.endpoint}/category/${category}`);
    return response.data;
  }

  async reorder(orderMap) {
    const response = await axios.post(`/${this.endpoint}/reorder`, orderMap);
    return response;
  }
}

export default new SkillsService();
