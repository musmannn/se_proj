import { Router } from 'express';
import AdminController from '../controllers/AdminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
const controller = new AdminController();

router.get('/dashboard', authenticateToken, requireAdmin, controller.getDashboardSummary);

export default router;
