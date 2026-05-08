import CategoryService from '../services/CategoryService.js';

export default class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  getCategories = (req, res, next) => {
    try {
      const data = this.categoryService.getAllCategories();
      res.json({ success: true, data, message: 'Categories fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  createCategory = (req, res, next) => {
    try {
      const data = this.categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data, message: 'Category created successfully' });
    } catch (error) {
      next(error);
    }
  };
}
