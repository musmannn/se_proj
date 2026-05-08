import ReviewService from '../services/ReviewService.js';

export default class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req, res, next) => {
    try {
      const data = await this.reviewService.addReview(req.user.userID, req.body);
      res.status(201).json({ success: true, data, message: 'Review submitted successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProductReviews = async (req, res, next) => {
    try {
      const data = await this.reviewService.getReviewsForProduct(Number(req.params.productId));
      res.json({ success: true, data, message: 'Reviews fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getInsights = async (req, res, next) => {
    try {
      const data = await this.reviewService.getInsights();
      res.json({ success: true, data, message: 'Review insights fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}
