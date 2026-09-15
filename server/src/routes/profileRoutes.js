import { Router } from 'express';
import { getProfile, updateProfile, getAIStatus } from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Profile routes require student authentication
router.use(authenticateUser);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.get('/ai-status', getAIStatus);

export default router;
