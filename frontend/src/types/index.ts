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

export interface RecommendedCrop {
  cropName: string;
  suitability: string;
  reason: string;
  waterRequirement: string;
  soilCompatibility: string;
  cultivationDuration: string;
  risks: string[];
}

export interface CropRecommendationResult {
  summary: string;
  recommendedCrops: RecommendedCrop[];
  generalRecommendations: string[];
  missingInformation: string[];
  limitations: string[];
}

export interface DiseaseCondition {
  name: string;
  likelihood: 'low' | 'moderate' | 'high' | 'unknown';
  symptoms: string[];
  possibleCauses: string[];
}

export interface DiseaseAnalysisResult {
  cropName: string;
  imageQuality: 'good' | 'acceptable' | 'poor';
  assessmentStatus: 'possible_match' | 'inconclusive' | 'insufficient_information';
  possibleConditions: DiseaseCondition[];
  recommendedActions: string[];
  preventiveMeasures: string[];
  safetyWarnings: string[];
  expertConsultationRecommended: boolean;
  limitations: string[];
}

export interface FertilizerAdvisoryResult {
  summary: string;
  possibleNutrientIssues: string[];
  managementRecommendations: string[];
  soilTestingRecommendations: string[];
  applicationTiming: string[];
  safetyPrecautions: string[];
  missingInformation: string[];
}

export interface IrrigationAdvisoryResult {
  summary: string;
  irrigationGuidance: string[];
  criticalGrowthStages: string[];
  waterSavingMethods: string[];
  waterStressWarnings: string[];
  missingInformation: string[];
  limitations: string[];
}

export interface AdvisoryRecord {
  id: string;
  user_id: string;
  advisory_type: 'crop_recommendation' | 'disease_detection' | 'fertilizer' | 'irrigation' | 'chat';
  title: string;
  input_data: Record<string, any>;
  result_data: any;
  language: SupportedLanguage;
  model_name?: string | null;
  created_at: string;
  updated_at: string;
  imageUrl?: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  language: SupportedLanguage;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatApiResponse {
  conversationId: string;
  answer: string;
  followUpQuestions: string[];
  warnings: string[];
  needsMoreInformation: boolean;
}

