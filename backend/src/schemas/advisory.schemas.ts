import { z } from 'zod';

// ==========================================
// 1. AUTHENTICATION & PROFILE SCHEMAS
// ==========================================

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const FarmerProfileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().nullable(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().max(100).optional().nullable(),
  preferred_language: z.enum(['en', 'kn']).default('en'),
  farming_experience_years: z.coerce.number().min(0).max(70).optional().nullable(),
  farm_area: z.coerce.number().positive('Farm area must be greater than 0').optional().nullable(),
  farm_area_unit: z.enum(['acres', 'hectares', 'guntas']).default('acres').optional().nullable(),
  soil_type: z.string().optional().nullable(),
  irrigation_type: z.string().optional().nullable(),
  farming_type: z.string().optional().nullable(),
});

// ==========================================
// 2. CROP RECOMMENDATION SCHEMAS
// ==========================================

export const CropRecommendationRequestSchema = z.object({
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Year-round', 'Monsoon', 'Winter', 'Summer']),
  soilType: z.string().min(2, 'Soil type is required'),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  farmArea: z.coerce.number().positive('Farm area must be positive'),
  areaUnit: z.enum(['acres', 'hectares', 'guntas']).default('acres'),
  waterAvailability: z.string().min(2, 'Water availability details are required'),
  irrigationMethod: z.string().optional().nullable(),
  averageRainfall: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
  previousCrop: z.string().optional().nullable(),
  farmingObjective: z.string().min(2, 'Farming objective is required'),
  budget: z.string().optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const CropItemSchema = z.object({
  cropName: z.string(),
  suitability: z.string(),
  reason: z.string(),
  waterRequirement: z.string(),
  soilCompatibility: z.string(),
  cultivationDuration: z.string(),
  risks: z.array(z.string()),
});

export const CropRecommendationResponseSchema = z.object({
  summary: z.string(),
  recommendedCrops: z.array(CropItemSchema),
  generalRecommendations: z.array(z.string()),
  missingInformation: z.array(z.string()),
  limitations: z.array(z.string()),
});

// ==========================================
// 3. DISEASE DETECTION SCHEMAS
// ==========================================

export const DiseaseDetectionRequestSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  symptoms: z.string().max(1000).optional().default(''),
  growthStage: z.string().optional().default(''),
  location: z.string().optional().default(''),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const PossibleConditionSchema = z.object({
  name: z.string(),
  likelihood: z.enum(['low', 'moderate', 'high', 'unknown']),
  symptoms: z.array(z.string()),
  possibleCauses: z.array(z.string()),
});

export const DiseaseDetectionResponseSchema = z.object({
  cropName: z.string(),
  imageQuality: z.enum(['good', 'acceptable', 'poor']),
  assessmentStatus: z.enum(['possible_match', 'inconclusive', 'insufficient_information']),
  possibleConditions: z.array(PossibleConditionSchema),
  recommendedActions: z.array(z.string()),
  preventiveMeasures: z.array(z.string()),
  safetyWarnings: z.array(z.string()),
  expertConsultationRecommended: z.boolean(),
  limitations: z.array(z.string()),
});

// ==========================================
// 4. FERTILIZER ADVISORY SCHEMAS
// ==========================================

export const FertilizerAdvisoryRequestSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  farmArea: z.coerce.number().positive('Farm area must be positive'),
  areaUnit: z.enum(['acres', 'hectares', 'guntas']).default('acres'),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  soilTestData: z.string().optional().nullable(),
  existingFertilizer: z.string().optional().nullable(),
  symptoms: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const FertilizerAdvisoryResponseSchema = z.object({
  summary: z.string(),
  possibleNutrientIssues: z.array(z.string()),
  managementRecommendations: z.array(z.string()),
  soilTestingRecommendations: z.array(z.string()),
  applicationTiming: z.array(z.string()),
  safetyPrecautions: z.array(z.string()),
  missingInformation: z.array(z.string()),
});

// ==========================================
// 5. IRRIGATION ADVISORY SCHEMAS
// ==========================================

export const IrrigationAdvisoryRequestSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  farmArea: z.coerce.number().positive('Farm area must be positive'),
  areaUnit: z.enum(['acres', 'hectares', 'guntas']).default('acres'),
  irrigationMethod: z.string().min(2, 'Irrigation method is required'),
  waterAvailability: z.string().min(2, 'Water availability is required'),
  recentRainfall: z.string().optional().nullable(),
  soilMoisture: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const IrrigationAdvisoryResponseSchema = z.object({
  summary: z.string(),
  irrigationGuidance: z.array(z.string()),
  criticalGrowthStages: z.array(z.string()),
  waterSavingMethods: z.array(z.string()),
  waterStressWarnings: z.array(z.string()),
  missingInformation: z.array(z.string()),
  limitations: z.array(z.string()),
});

// ==========================================
// 6. FARMING ASSISTANT (CHAT) SCHEMAS
// ==========================================

export const ChatMessageRequestSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(3000, 'Message is too long'),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
  farmerContext: z.record(z.unknown()).optional(),
});

export const ChatResponseSchema = z.object({
  answer: z.string(),
  followUpQuestions: z.array(z.string()),
  warnings: z.array(z.string()),
  needsMoreInformation: z.boolean(),
});

// ==========================================
// 7. COMMON UTILITY SCHEMAS
// ==========================================

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(['crop_recommendation', 'disease_detection', 'fertilizer', 'irrigation', 'chat']).optional(),
});

export const UuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

