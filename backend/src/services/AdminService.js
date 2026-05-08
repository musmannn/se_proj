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

  async getDashboardSummary() {
    const [products, orders, lowStock, avgRating] = await Promise.all([
      this.productRepository.getAll(),
      this.orderRepository.getAll(),
      this.inventoryRepository.getLowStockAlerts(),
      this.reviewRepository.getOverallAverageRating()
    ]);
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      lowStockCount: lowStock.length,
      avgRating
    };
  }
}
