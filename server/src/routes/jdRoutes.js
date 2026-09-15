import { Router } from 'express';
import { analyzeJobDescription } from '../controllers/jdController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// JD analysis requires student authentication
router.use(authenticateUser);

router.post('/analyze', analyzeJobDescription);

export default router;
