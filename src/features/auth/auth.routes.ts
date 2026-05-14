import { Router } from 'express';
import authController from './auth.controller.js';
import { loginValidation } from './auth.validation.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);

export default router;
