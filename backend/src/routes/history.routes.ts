import { Router } from 'express';
import { getHistory, getAdvisoryDetail, deleteAdvisory } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateParams, validateQuery } from '../middleware/validate.middleware.js';
import { PaginationQuerySchema, UuidParamSchema } from '../schemas/advisory.schemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(PaginationQuerySchema), getHistory);
router.get('/:id', validateParams(UuidParamSchema), getAdvisoryDetail);
router.delete('/:id', validateParams(UuidParamSchema), deleteAdvisory);

export default router;

