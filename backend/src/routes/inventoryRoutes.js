import { Router } from 'express';
import InventoryController from '../controllers/InventoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
const controller = new InventoryController();

router.get('/alerts', authenticateToken, requireAdmin, controller.getAlerts);
router.get('/all', authenticateToken, requireAdmin, controller.getAll);
router.get('/:productId', controller.getByProductId);
router.put('/:inventoryId', authenticateToken, requireAdmin, controller.updateInventory);

export default router;
