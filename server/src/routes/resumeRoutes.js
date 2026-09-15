import { Router } from 'express';
import {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume
} from '../controllers/resumeController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// All resume routes require student authentication
router.use(authenticateUser);

router.post('/upload', upload.single('resume'), uploadResume);
router.post('/:id/analyze', analyzeResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
