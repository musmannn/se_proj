import { Router } from 'express';
import CategoryController from '../controllers/CategoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
const controller = new CategoryController();

router.get('/', controller.getCategories);
router.post('/', authenticateToken, requireAdmin, controller.createCategory);

export default router;
