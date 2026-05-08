import ProductRepository from '../repositories/ProductRepository.js';
import InventoryRepository from '../repositories/InventoryRepository.js';

export default class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.inventoryRepository = new InventoryRepository();
  }

  getProducts(filters) {
    return this.productRepository.getAll(filters);
  }

  getProductById(id) {
    const product = this.productRepository.getProductDetails(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  createProduct(payload) {
    const product = this.productRepository.create({
      name: payload.name,
      imageUrl: payload.imageUrl || null,
      price: Number(payload.price),
      fabric: payload.fabric,
      cut: payload.cut,
      season: payload.season,
      gsm: Number(payload.gsm),
      status: payload.status || 'active',
      categoryID: Number(payload.categoryID)
    });

    if (Array.isArray(payload.inventory)) {
      payload.inventory.forEach((item) => {
        this.inventoryRepository.create({
          productID: product.productID,
          size: item.size,
          stockQty: Number(item.stockQty || 0),
          safetyStock: Number(item.safetyStock || 0)
        });
      });
    }

    return this.productRepository.getProductDetails(product.productID);
  }

  updateProduct(id, payload) {
    const existing = this.productRepository.getById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    return this.productRepository.update(id, {
      name: payload.name ?? existing.name,
      imageUrl: payload.imageUrl ?? existing.imageUrl,
      price: payload.price !== undefined ? Number(payload.price) : existing.price,
      fabric: payload.fabric ?? existing.fabric,
      cut: payload.cut ?? existing.cut,
      season: payload.season ?? existing.season,
      gsm: payload.gsm !== undefined ? Number(payload.gsm) : existing.gsm,
      status: payload.status ?? existing.status,
      categoryID: payload.categoryID !== undefined ? Number(payload.categoryID) : existing.categoryID
    });
  }

  softDeleteProduct(id) {
    const existing = this.productRepository.getById(id);
    if (!existing) {
      throw new Error('Product not found');
    }
    return this.productRepository.softDelete(id);
  }
}
