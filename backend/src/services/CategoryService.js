import CategoryRepository from '../repositories/CategoryRepository.js';

export default class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    return this.categoryRepository.getAll();
  }

  async createCategory(payload) {
    if (!payload.name) {
      throw new Error('Category name is required');
    }
    return this.categoryRepository.create(payload);
  }
}
