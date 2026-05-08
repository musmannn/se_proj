import ReviewService from '../services/ReviewService.js';

export default class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = (req, res, next) => {
    try {
      const data = this.reviewService.addReview(req.user.userID, req.body);
      res.status(201).json({ success: true, data, message: 'Review submitted successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProductReviews = (req, res, next) => {
    try {
      const data = this.reviewService.getReviewsForProduct(Number(req.params.productId));
      res.json({ success: true, data, message: 'Reviews fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getInsights = (req, res, next) => {
    try {
      const data = this.reviewService.getInsights();
      res.json({ success: true, data, message: 'Review insights fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}
