// src/services/socialMediaService.js
import { BaseService } from './baseService';

class SocialMediaService extends BaseService {
  constructor() {
    // تعديل الاسم ليكون SocialMedia بحرف كبير لضمان تطابقه مع الـ Controller
    super('SocialMedia');
  }
}

export default new SocialMediaService();
