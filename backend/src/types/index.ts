import { User } from '@supabase/supabase-js';
import { Request } from 'express';

// Extend Express Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type SupportedLanguage = 'en' | 'kn';

export interface FarmerProfile {
  id: string;
  full_name: string;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  village?: string | null;
  preferred_language: SupportedLanguage;
  farming_experience_years?: number | null;
  farm_area?: number | null;
  farm_area_unit?: 'acres' | 'hectares' | 'guntas' | null;
  soil_type?: string | null;
  irrigation_type?: string | null;
  farming_type?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRecord {
  id: string;
  user_id: string;
  advisory_type: 'crop_recommendation' | 'disease_detection' | 'fertilizer' | 'irrigation' | 'chat';
  title: string;
  input_data: Record<string, unknown>;
  result_data: Record<string, unknown>;
  language: SupportedLanguage;
  model_name?: string | null;
  created_at: string;
  updated_at: string;
}

