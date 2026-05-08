import ProductService from '../services/ProductService.js';

export default class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getProducts = async (req, res, next) => {
    try {
      const data = await this.productService.getProducts(req.query);
      res.json({ success: true, data, message: 'Products fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const data = await this.productService.getProductById(Number(req.params.id));
      res.json({ success: true, data, message: 'Product fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const data = await this.productService.createProduct(req.body);
      res.status(201).json({ success: true, data, message: 'Product created successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const data = await this.productService.updateProduct(Number(req.params.id), req.body);
      res.json({ success: true, data, message: 'Product updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const data = await this.productService.softDeleteProduct(Number(req.params.id));
      res.json({ success: true, data, message: 'Product discontinued successfully' });
    } catch (error) {
      next(error);
    }
  };
}
