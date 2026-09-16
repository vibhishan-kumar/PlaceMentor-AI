import { Router } from 'express';
import {
  getUserChats,
  createChat,
  getChatById,
  sendMessage,
  renameChat,
  deleteChat
} from '../controllers/chatController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// All chat routes require student authentication
router.use(authenticateUser);

router.get('/', getUserChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.post('/:id/messages', upload.single('resume'), sendMessage);
router.patch('/:id', renameChat);
router.delete('/:id', deleteChat);

export default router;
