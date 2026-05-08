import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authenticateToken, controller.profile);
router.put('/profile', authenticateToken, controller.updateProfile);
router.put('/profile/password', authenticateToken, controller.updatePassword);

export default router;
