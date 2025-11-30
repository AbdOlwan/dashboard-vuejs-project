// src/services/certificationsService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class CertificationsService extends BaseService {
  constructor() {
    super('certifications');
  }

  // Override getAll to use /all endpoint
  async getAll() {
try {
      // نطلب البيانات من السيرفر
      const response = await axios.get(`/${this.endpoint}/all`);

      // التحقق واستخراج المصفوفة (Data Unwrapping)
      // حسب BaseApiController، البيانات تكون داخل response.data
      if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return []; // إرجاع مصفوفة فارغة في حالة عدم العثور على بيانات لتجنب الخطأ
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new CertificationsService();
