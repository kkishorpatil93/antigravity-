import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ProfileFormSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().optional().nullable(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional().nullable(),
  preferred_language: z.enum(['en', 'kn']).default('en'),
  farming_experience_years: z.coerce.number().min(0).max(70).optional().nullable(),
  farm_area: z.coerce.number().positive('Area must be greater than 0').optional().nullable(),
  farm_area_unit: z.enum(['acres', 'hectares', 'guntas']).default('acres'),
  soil_type: z.string().optional().nullable(),
  irrigation_type: z.string().optional().nullable(),
  farming_type: z.string().optional().nullable(),
});

export const CropRecommendationFormSchema = z.object({
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

export const DiseaseDetectionFormSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  symptoms: z.string().max(1000).optional().default(''),
  growthStage: z.string().optional().default(''),
  location: z.string().optional().default(''),
  preferredLanguage: z.enum(['en', 'kn']).default('en'),
});

export const FertilizerFormSchema = z.object({
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

export const IrrigationFormSchema = z.object({
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

