import ProductRepository from '../repositories/ProductRepository.js';
import OrderRepository from '../repositories/OrderRepository.js';
import InventoryRepository from '../repositories/InventoryRepository.js';
import ReviewRepository from '../repositories/ReviewRepository.js';

export default class AdminService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.orderRepository = new OrderRepository();
    this.inventoryRepository = new InventoryRepository();
    this.reviewRepository = new ReviewRepository();
  }

  getDashboardSummary() {
    return {
      totalProducts: this.productRepository.getAll().length,
      totalOrders: this.orderRepository.getAll().length,
      lowStockCount: this.inventoryRepository.getLowStockAlerts().length,
      avgRating: this.reviewRepository.getOverallAverageRating()
    };
  }
}
