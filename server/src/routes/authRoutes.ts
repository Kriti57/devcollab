import { Router } from 'express';
import { register, login, getMe, updateProfile, getUserById  } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes (no authentication needed)
router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserById);

// Protected route (authentication required)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;