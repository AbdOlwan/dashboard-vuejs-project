// src/services/siteSettingsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class SiteSettingsService extends BaseService {
  constructor() {
    super('sitesettings');
  }

  async getDictionary() {
    const response = await axios.get(`/${this.endpoint}/dictionary`);
    return response.data;
  }

  async getByKey(key) {
    const response = await axios.get(`/${this.endpoint}/key/${key}`);
    return response.data;
  }
}

export default new SiteSettingsService();
