// src/services/baseService.js
import axios from '@/plugins/axios';

/**
 * Base Service Class - CRUD Operations Template
 */
export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Get all items
   */
  async getAll() {
    try {
      const response = await axios.get(`/${this.endpoint}`);

      // التحقق مما إذا كانت الاستجابة مصفوفة مباشرة أو مغلفة
      if (Array.isArray(response)) {
        return response;
      }
      else if (response && Array.isArray(response.data)) {
        return response.data;
      }
      else if (response && Array.isArray(response.result)) {
        return response.result;
      }

      return response || [];

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active items
   */
  async getActive() {
    try {
      const response = await axios.get(`/${this.endpoint}/active`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get item by ID
   */
  async getById(id) {
    try {
      console.log(`🔍 BaseService: Fetching ${this.endpoint}/${id}`);
      const response = await axios.get(`/${this.endpoint}/${id}`);
      console.log('✅ BaseService: Response received:', response);

      // ✅ إذا كانت الاستجابة مغلفة في data، استخرجها
      if (response && response.data) {
        return response.data;
      }

      // ✅ إذا كانت الاستجابة مباشرة
      return response;

    } catch (error) {
      console.error('❌ BaseService: Error in getById:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create new item
   */
  async create(data) {
    try {
      const response = await axios.post(`/${this.endpoint}`, data);

      // استخراج البيانات من الغلاف إن وجد
      if (response && response.data) {
        return response.data;
      }
      return response;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing item
   */
  async update(id, data) {
    try {
      const response = await axios.put(`/${this.endpoint}/${id}`, data);

      // استخراج البيانات من الغلاف إن وجد
      if (response && response.data) {
        return response.data;
      }
      return response;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete item
   */
  async delete(id) {
    try {
      const response = await axios.delete(`/${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    try {
      const response = await axios.patch(`/${this.endpoint}/${id}/toggle-active`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized error handler
   */
  handleError(error) {
    console.error('❌ BaseService Error:', error);

    if (error.response?.data) {
      return {
        message: error.response.data.message || 'حدث خطأ',
        errors: error.response.data.errors || [],
        statusCode: error.response.status
      };
    }
    return {
      message: error.message || 'خطأ في الاتصال بالخادم',
      errors: [],
      statusCode: 500
    };
  }
}
