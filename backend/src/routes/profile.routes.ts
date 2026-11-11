import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { FarmerProfileUpdateSchema } from '../schemas/advisory.schemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', getProfile);
router.put('/', validateBody(FarmerProfileUpdateSchema), updateProfile);

export default router;

