// src/services/aboutMeService.js
import axios from '@/plugins/axios';

class AboutMeService {
  // جلب البيانات
  async get() {
    try {
      // Axios Interceptor already returns response.data (The full API response body)
      const response = await axios.get('/AboutMe');

      // The API structure is { success: true, data: { ... }, message: ... }
      // We need to return the 'data' property only.
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // إنشاء أو تحديث
  async createOrUpdate(data) {
    const response = await axios.post('/AboutMe', data);
    return response.data; // نفس التعديل هنا، إزالة .data الزائدة
  }
}

export default new AboutMeService();
