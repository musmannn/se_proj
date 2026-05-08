import { Router } from 'express';
import ReviewController from '../controllers/ReviewController.js';
import { authenticateToken, requireAdmin, requireCustomer } from '../middleware/auth.js';

const router = Router();
const controller = new ReviewController();

router.post('/', authenticateToken, requireCustomer, controller.createReview);
router.get('/product/:productId', controller.getProductReviews);
router.get('/insights', authenticateToken, requireAdmin, controller.getInsights);

export default router;
