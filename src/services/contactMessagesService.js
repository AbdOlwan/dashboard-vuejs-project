// src/services/contactMessagesService.js
import { BaseService } from './baseService';
import axios from '@/plugins/axios';

class ContactMessagesService extends BaseService {
  constructor() {
    super('contactmessages');
  }

  async getUnread() {
    const response = await axios.get(`/${this.endpoint}/unread`);
    return response.data;
  }

  async getUnreadCount() {
    const response = await axios.get(`/${this.endpoint}/unread/count`);
    return response.data;
  }

  async markAsRead(id) {
    const response = await axios.patch(`/${this.endpoint}/${id}/read`);
    return response;
  }

  async markAsUnread(id) {
    const response = await axios.patch(`/${this.endpoint}/${id}/unread`);
    return response;
  }
}

export default new ContactMessagesService();
