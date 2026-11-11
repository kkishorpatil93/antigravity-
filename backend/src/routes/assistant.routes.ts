import { Router } from 'express';
import {
  chat,
  getConversations,
  createConversation,
  getMessages,
  deleteConversation,
} from '../controllers/assistant.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody, validateParams } from '../middleware/validate.middleware.js';
import { ChatMessageRequestSchema, UuidParamSchema } from '../schemas/advisory.schemas.js';

const router = Router();

router.use(requireAuth);

router.post('/chat', validateBody(ChatMessageRequestSchema), chat);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', validateParams(UuidParamSchema), getMessages);
router.delete('/conversations/:id', validateParams(UuidParamSchema), deleteConversation);

export default router;

