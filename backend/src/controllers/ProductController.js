import ProductService from '../services/ProductService.js';

export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getProducts = (req, res, next) => {
    try {
      const data = this.productService.getProducts(req.query);
      res.json({ success: true, data, message: 'Products fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProductById = (req, res, next) => {
    try {
      const data = this.productService.getProductById(Number(req.params.id));
      res.json({ success: true, data, message: 'Product fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  createProduct = (req, res, next) => {
    try {
      const data = this.productService.createProduct(req.body);
      res.status(201).json({ success: true, data, message: 'Product created successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = (req, res, next) => {
    try {
      const data = this.productService.updateProduct(Number(req.params.id), req.body);
      res.json({ success: true, data, message: 'Product updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = (req, res, next) => {
    try {
      const data = this.productService.softDeleteProduct(Number(req.params.id));
      res.json({ success: true, data, message: 'Product discontinued successfully' });
    } catch (error) {
      next(error);
    }
  };
}
