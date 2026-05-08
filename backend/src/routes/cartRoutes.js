import { Router } from 'express';
import CartController from '../controllers/CartController.js';
import { authenticateToken, requireCustomer } from '../middleware/auth.js';

const router = Router();
const controller = new CartController();

router.get('/', authenticateToken, requireCustomer, controller.getCart);
router.post('/items', authenticateToken, requireCustomer, controller.addItem);
router.put('/items/:cartItemId', authenticateToken, requireCustomer, controller.updateItem);
router.delete('/items/:cartItemId', authenticateToken, requireCustomer, controller.removeItem);

export default router;
