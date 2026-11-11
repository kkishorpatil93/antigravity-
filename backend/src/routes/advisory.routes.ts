import { Router } from 'express';
import {
  cropRecommendation,
  diseaseDetection,
  fertilizerAdvisory,
  irrigationAdvisory,
  getDiseaseDetectionById,
} from '../controllers/advisory.controller.js';
import { getAdvisoryDetail } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { validateBody, validateParams } from '../middleware/validate.middleware.js';
import {
  CropRecommendationRequestSchema,
  FertilizerAdvisoryRequestSchema,
  IrrigationAdvisoryRequestSchema,
  UuidParamSchema,
} from '../schemas/advisory.schemas.js';

const router = Router();

// Protect all advisory endpoints with auth
router.use(requireAuth);

// 1. Crop Recommendation
router.post(
  '/crop-recommendation',
  validateBody(CropRecommendationRequestSchema),
  cropRecommendation
);

router.get(
  '/crop-recommendation/:id',
  validateParams(UuidParamSchema),
  getAdvisoryDetail
);

// 2. Disease Detection
router.post(
  '/disease-detection',
  uploadImage.single('image'),
  diseaseDetection
);

router.get(
  '/disease-detection/:id',
  validateParams(UuidParamSchema),
  getDiseaseDetectionById
);

// 3. Fertilizer Advisory
router.post(
  '/fertilizer',
  validateBody(FertilizerAdvisoryRequestSchema),
  fertilizerAdvisory
);

router.get(
  '/fertilizer/:id',
  validateParams(UuidParamSchema),
  getAdvisoryDetail
);

// 4. Irrigation Advisory
router.post(
  '/irrigation',
  validateBody(IrrigationAdvisoryRequestSchema),
  irrigationAdvisory
);

router.get(
  '/irrigation/:id',
  validateParams(UuidParamSchema),
  getAdvisoryDetail
);

export default router;

