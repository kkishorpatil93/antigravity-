import { GoogleGenAI, Type, Schema } from '@google/genai';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import {
  CropRecommendationResponseSchema,
  DiseaseDetectionResponseSchema,
  FertilizerAdvisoryResponseSchema,
  IrrigationAdvisoryResponseSchema,
  ChatResponseSchema,
} from '../../schemas/advisory.schemas.js';

// Initialize the official Google Gen AI client
export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const AGRICULTURAL_SYSTEM_PROMPT = `
You are AgroPulse Core, an AI-powered agricultural advisory assistant designed to support farmers in India, especially Karnataka.

Your role is to provide understandable, practical, cautious, and evidence-informed agricultural recommendations.

You help farmers with:
1. Crop selection.
2. Crop disease identification.
3. Fertilizer management.
4. Irrigation.
5. Pest management.
6. Soil health.
7. Crop cultivation.
8. Farming practices.
9. General agriculture questions.

CORE RULES:
- Use simple language.
- Respond in the language requested by the user: English if 'en', Kannada if 'kn'. If 'kn' is requested, all explanations, reasons, and actions MUST be written in natural, fluent Kannada (Kannada script).
- Prefer practical instructions.
- Explain agricultural terminology simply.
- Consider the user's location, soil, crop, season, irrigation availability, and farming conditions.
- Do not assume missing information.
- Ask clarifying questions when essential information is missing.
- Clearly distinguish facts from estimates.
- Clearly communicate uncertainty.
- Do not guarantee crop yield, profit, or farming success.
- Do not invent weather data.
- Do not invent soil test results.
- Do not invent government scheme eligibility.
- Do not invent pesticide approvals.
- Do not invent fertilizer application rates.
- Do not provide unsupported chemical dosage instructions.
- Avoid dangerous or environmentally harmful advice.
- Recommend soil testing when appropriate.
- Recommend local agricultural experts when uncertainty is high.
- Recommend local agricultural extension services or Krishi Vigyan Kendras (KVKs) when appropriate.
- Consider Indian agricultural conditions and Karnataka agro-climatic zones (Coastal, Hill, Northern Dry, Central Dry, Southern Dry, Southern Transition, Northern Transition zones).
- Provide actionable recommendations.
- Mention important risks and limitations.
- Do not claim to be a human agricultural expert.
- Do not claim laboratory-confirmed disease diagnosis.

DISEASE IDENTIFICATION (MULTIMODAL):
- Analyze visible symptoms cautiously.
- Identify possible diseases rather than confirmed diagnoses.
- Explain when image quality is insufficient.
- Request clearer images when necessary.
- Consider pests, nutrient deficiencies, and environmental stress as alternative explanations.
- Follow Integrated Pest Management (IPM): Cultural -> Biological -> Chemical as last resort.
- Avoid unsupported pesticide prescriptions.

CHEMICAL SAFETY:
- Do not recommend banned chemicals.
- Do not invent pesticide registration information or label instructions.
- Do not encourage mixing chemicals without verified compatibility.
- Recommend following approved product labels and protective equipment (PPE).

OUTPUT FORMAT:
- Follow the requested JSON schema strictly.
- Never output markdown backticks or commentary outside the JSON.
- Never return fabricated confidence.
`;

// ==========================================
// GEMINI JSON SCHEMAS (@google/genai Type)
// ==========================================

const cropRecommendationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    recommendedCrops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          suitability: { type: Type.STRING },
          reason: { type: Type.STRING },
          waterRequirement: { type: Type.STRING },
          soilCompatibility: { type: Type.STRING },
          cultivationDuration: { type: Type.STRING },
          risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'cropName',
          'suitability',
          'reason',
          'waterRequirement',
          'soilCompatibility',
          'cultivationDuration',
          'risks',
        ],
      },
    },
    generalRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'summary',
    'recommendedCrops',
    'generalRecommendations',
    'missingInformation',
    'limitations',
  ],
};

const diseaseDetectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cropName: { type: Type.STRING },
    imageQuality: {
      type: Type.STRING,
      enum: ['good', 'acceptable', 'poor'],
    },
    assessmentStatus: {
      type: Type.STRING,
      enum: ['possible_match', 'inconclusive', 'insufficient_information'],
    },
    possibleConditions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          likelihood: {
            type: Type.STRING,
            enum: ['low', 'moderate', 'high', 'unknown'],
          },
          symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          possibleCauses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['name', 'likelihood', 'symptoms', 'possibleCauses'],
      },
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    preventiveMeasures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    safetyWarnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    expertConsultationRecommended: { type: Type.BOOLEAN },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'cropName',
    'imageQuality',
    'assessmentStatus',
    'possibleConditions',
    'recommendedActions',
    'preventiveMeasures',
    'safetyWarnings',
    'expertConsultationRecommended',
    'limitations',
  ],
};

const fertilizerAdvisorySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    possibleNutrientIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    managementRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    soilTestingRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    applicationTiming: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    safetyPrecautions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'summary',
    'possibleNutrientIssues',
    'managementRecommendations',
    'soilTestingRecommendations',
    'applicationTiming',
    'safetyPrecautions',
    'missingInformation',
  ],
};

const irrigationAdvisorySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    irrigationGuidance: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    criticalGrowthStages: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    waterSavingMethods: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    waterStressWarnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'summary',
    'irrigationGuidance',
    'criticalGrowthStages',
    'waterSavingMethods',
    'waterStressWarnings',
    'missingInformation',
    'limitations',
  ],
};

const chatResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    needsMoreInformation: { type: Type.BOOLEAN },
  },
  required: ['answer', 'followUpQuestions', 'warnings', 'needsMoreInformation'],
};

// Clean raw JSON response from AI
function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// ==========================================
// SERVICE IMPLEMENTATIONS
// ==========================================

export class GeminiService {
  /**
   * 1. Crop Recommendation Service
   */
  static async generateCropRecommendation(data: {
    state: string;
    district: string;
    season: string;
    soilType: string;
    soilPh?: number | null;
    farmArea: number;
    areaUnit: string;
    waterAvailability: string;
    irrigationMethod?: string | null;
    averageRainfall?: string | null;
    temperature?: string | null;
    previousCrop?: string | null;
    farmingObjective: string;
    budget?: string | null;
    preferredLanguage: 'en' | 'kn';
  }) {
    const prompt = `
Recommend crops suitable for the farmer's conditions.

FARMER DETAILS:
- Location: ${data.district}, ${data.state}, India
- Season: ${data.season}
- Soil Type: ${data.soilType}
- Soil pH: ${data.soilPh ?? 'Not provided'}
- Land Area: ${data.farmArea} ${data.areaUnit}
- Water Availability: ${data.waterAvailability}
- Irrigation Setup: ${data.irrigationMethod ?? 'Traditional / Rainfed'}
- Previous Crop: ${data.previousCrop ?? 'None / Fallow'}
- Average Rainfall: ${data.averageRainfall ?? 'Regional average'}
- Temperature Condition: ${data.temperature ?? 'Normal seasonal'}
- Farming Objective: ${data.farmingObjective}
- Budget Level: ${data.budget ?? 'Standard'}

Respond in ${data.preferredLanguage === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
Provide practical, suitable crop recommendations for this region. Explain reasons, water needs, duration, and key risks.
`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: cropRecommendationSchema,
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }

      const parsed = JSON.parse(cleanJsonText(text));
      return CropRecommendationResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Gemini generateCropRecommendation error:', error);
      throw error;
    }
  }

  /**
   * 2. Multimodal Disease Detection Service
   */
  static async analyzeCropDisease(
    data: {
      cropName: string;
      symptoms?: string;
      growthStage?: string;
      location?: string;
      preferredLanguage: 'en' | 'kn';
    },
    imageBuffer: Buffer,
    mimeType: string
  ) {
    const prompt = `
Analyze the attached crop photograph along with farmer observations to assess plant pathology.

FARMER CONTEXT:
- Target Crop: ${data.cropName}
- Observed Symptoms: ${data.symptoms || 'Visible in image'}
- Crop Growth Stage: ${data.growthStage || 'Not specified'}
- Location: ${data.location || 'Karnataka / India'}

INSTRUCTIONS:
1. Carefully inspect the photograph for leaf lesions, chlorosis, necrosis, rust, powdery spots, leaf curl, wilting, or insect pest signs.
2. Evaluate image quality ('good', 'acceptable', or 'poor'). If blurry or not a plant, mark assessmentStatus as 'inconclusive' or 'insufficient_information'.
3. Detail possible conditions with likelihood ('low', 'moderate', 'high').
4. Deliver practical Integrated Pest Management (IPM) measures, safety warnings, and specify whether a visit to a local Krishi Vigyan Kendra (KVK) is recommended.
5. Respond in ${data.preferredLanguage === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType,
              data: imageBuffer.toString('base64'),
            },
          },
        ],
        config: {
          systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: diseaseDetectionSchema,
          temperature: 0.1,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini Vision');
      }

      const parsed = JSON.parse(cleanJsonText(text));
      return DiseaseDetectionResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Gemini analyzeCropDisease error:', error);
      throw error;
    }
  }

  /**
   * 3. Fertilizer Advisory Service
   */
  static async generateFertilizerAdvisory(data: {
    crop: string;
    growthStage: string;
    soilType: string;
    farmArea: number;
    areaUnit: string;
    soilPh?: number | null;
    soilTestData?: string | null;
    existingFertilizer?: string | null;
    symptoms?: string | null;
    location?: string | null;
    preferredLanguage: 'en' | 'kn';
  }) {
    const prompt = `
Provide general crop nutrient management guidance.

CROP & SOIL METRICS:
- Crop: ${data.crop}
- Current Growth Stage: ${data.growthStage}
- Soil Type: ${data.soilType}
- Soil pH: ${data.soilPh ?? 'Not tested'}
- Field Area: ${data.farmArea} ${data.areaUnit}
- Soil Test Report: ${data.soilTestData ?? 'No formal soil test available'}
- Current / Past Fertilizer Used: ${data.existingFertilizer ?? 'None specified'}
- Observed Symptoms / Deficiencies: ${data.symptoms ?? 'None specified'}
- Location: ${data.location ?? 'Karnataka, India'}

Do not invent unsupported chemical dosages. Recommend soil testing where appropriate, specify split application timing (Basal, Vegetative, Flowering), organic alternatives (FYM, Vermicompost), and safety precautions.
Respond in ${data.preferredLanguage === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: fertilizerAdvisorySchema,
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(cleanJsonText(text));
      return FertilizerAdvisoryResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Gemini generateFertilizerAdvisory error:', error);
      throw error;
    }
  }

  /**
   * 4. Irrigation Advisory Service
   */
  static async generateIrrigationAdvisory(data: {
    crop: string;
    growthStage: string;
    soilType: string;
    farmArea: number;
    areaUnit: string;
    irrigationMethod: string;
    waterAvailability: string;
    recentRainfall?: string | null;
    soilMoisture?: string | null;
    location?: string | null;
    preferredLanguage: 'en' | 'kn';
  }) {
    const prompt = `
Provide practical irrigation management guidance.

PARAMETERS:
- Crop: ${data.crop}
- Growth Stage: ${data.growthStage}
- Soil Type: ${data.soilType}
- Farm Area: ${data.farmArea} ${data.areaUnit}
- Primary Irrigation Method: ${data.irrigationMethod}
- Water Availability: ${data.waterAvailability}
- Recent Rainfall: ${data.recentRainfall ?? 'Unknown / None'}
- Soil Moisture Condition: ${data.soilMoisture ?? 'Not tested'}
- Location: ${data.location ?? 'Karnataka, India'}

Guidance must include critical moisture-sensitive growth stages, water-saving techniques (mulching, drip timing), moisture checking tips, and water stress warnings.
Respond in ${data.preferredLanguage === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: irrigationAdvisorySchema,
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(cleanJsonText(text));
      return IrrigationAdvisoryResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Gemini generateIrrigationAdvisory error:', error);
      throw error;
    }
  }

  /**
   * 5. General Agricultural Chat Service
   */
  static async generateFarmingChatResponse(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    preferredLanguage: 'en' | 'kn',
    farmerContext?: Record<string, unknown>
  ) {
    const contextSnippet = farmerContext
      ? `FARMER CONTEXT:\n${JSON.stringify(farmerContext, null, 2)}`
      : 'No additional profile context provided.';

    const formattedHistory = history.slice(-6).map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));

    const currentPrompt = `
${contextSnippet}

FARMER QUESTION:
${message}

Respond in ${preferredLanguage === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'}.
Focus strictly on practical agricultural advisory. If the topic is non-agricultural, politely redirect the farmer to farming questions.
`;

    try {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: [
          ...formattedHistory,
          {
            role: 'user',
            parts: [{ text: currentPrompt }],
          },
        ],
        config: {
          systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: chatResponseSchema,
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini Chat');
      }

      const parsed = JSON.parse(cleanJsonText(text));
      return ChatResponseSchema.parse(parsed);
    } catch (error) {
      logger.error('Gemini generateFarmingChatResponse error:', error);
      throw error;
    }
  }
}

