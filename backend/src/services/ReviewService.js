import ReviewRepository from '../repositories/ReviewRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';

export default class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.productRepository = new ProductRepository();
  }

  async addReview(userID, payload) {
    const { productId, rating, comment } = payload;
    const product = await this.productRepository.getById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const parsedRating = Number(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!comment) {
      throw new Error('Comment is required');
    }

    return this.reviewRepository.create({ userID, productID: Number(productId), rating: parsedRating, comment });
  }

  async getReviewsForProduct(productId) {
    return this.reviewRepository.getByProductId(productId);
  }

  async getInsights() {
    const [avgRating, products] = await Promise.all([
      this.reviewRepository.getOverallAverageRating(),
      this.reviewRepository.getInsights()
    ]);
    return {
      avgRating,
      products
    };
  }
}
