import { Router } from 'express';
import OrderController from '../controllers/OrderController.js';
import { authenticateToken, requireAdmin, requireCustomer } from '../middleware/auth.js';

const router = Router();
const controller = new OrderController();

router.post('/checkout', authenticateToken, requireCustomer, controller.checkout);
router.get('/', authenticateToken, requireCustomer, controller.getOwnOrders);
router.get('/all', authenticateToken, requireAdmin, controller.getAllOrders);
router.get('/:id', authenticateToken, controller.getOrderById);
router.put('/:id/cancel', authenticateToken, requireCustomer, controller.cancelOwnOrder);
router.put('/:id/status', authenticateToken, requireAdmin, controller.updateOrderStatus);

export default router;
