// src/services/experiencesService.js
import { BaseService } from './baseService';

class ExperiencesService extends BaseService {
  constructor() {
    super('experiences');
  }
}

export default new ExperiencesService();
