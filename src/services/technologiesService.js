// src/services/technologiesService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class TechnologiesService extends BaseService {
  constructor() {
    super('technologies');
  }

  async getByCategory(category) {
    const response = await axios.get(`/${this.endpoint}/category/${category}`);
    return response.data; // هذا السطر كان خاطئاً في ملفك الأصلي، axios interceptor يعالج .data
  }

  // ==== الدالة الجديدة التي يجب إضافتها ====
  async toggleActive(id) {
    const response = await axios.patch(`/${this.endpoint}/${id}/toggle-active`);
    return response; // الـ Interceptor سيعالج الـ response.data
  }
  // ======================================
}

export default new TechnologiesService();
