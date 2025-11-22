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
// src/services/baseService.js

  /**
   * Get all items
   */
  async getAll() {
    try {
      const response = await axios.get(`/${this.endpoint}`);

      // إصلاح: التحقق مما إذا كانت الاستجابة هي المصفوفة مباشرة أو مغلفة داخل خاصية
      if (Array.isArray(response)) {
        return response;
      }
      // التعامل مع الـ Wrapper الشائع (مثلاً ApiResponse يحتوي على data أو result)
      else if (response && Array.isArray(response.data)) {
        return response.data;
      }
      else if (response && Array.isArray(response.result)) {
        return response.result;
      }

      // إذا لم نستطع استخراج مصفوفة، نعيد المصفوفة كما هي (أو فارغة) لتجنب الخطأ
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
      return response; // تم التعديل
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get item by ID
   */
  async getById(id) {
    try {
      const response = await axios.get(`/${this.endpoint}/${id}`);
      return response; // تم التعديل
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new item
   */
  async create(data) {
    try {
      const response = await axios.post(`/${this.endpoint}`, data);
      return response; // تم التعديل
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
      return response; // تم التعديل
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete item
   */
  async delete(id) {
    try {
      // Delete usually returns 200 OK with simple message, axios interceptor handles it
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
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'حدث خطأ',
        errors: error.response.data.errors || [],
        statusCode: error.response.status
      };
    }
    return {
      message: 'خطأ في الاتصال بالخادم',
      errors: [],
      statusCode: 500
    };
  }
}
