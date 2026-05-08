import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', authenticateToken, requireAdmin, controller.createProduct);
router.put('/:id', authenticateToken, requireAdmin, controller.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, controller.deleteProduct);

export default router;
