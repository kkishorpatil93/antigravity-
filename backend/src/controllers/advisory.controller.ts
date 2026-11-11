import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { GeminiService } from '../services/gemini/gemini.service.js';
import { supabaseAdmin, uploadCropImage, getSignedImageUrl } from '../services/supabase/supabase.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * 1. Generate & Save Crop Recommendation
 */
export async function cropRecommendation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const inputData = req.body;

    logger.info(`Generating crop recommendations for user ${userId} in ${inputData.district}, ${inputData.state}`);

    // Call Gemini with structured output
    const aiResult = await GeminiService.generateCropRecommendation(inputData);

    const title = `${inputData.season} Crop Recommendation - ${inputData.district}`;

    // Store in PostgreSQL advisories table
    const { data: advisoryRecord, error: insertError } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        advisory_type: 'crop_recommendation',
        title,
        input_data: inputData,
        result_data: aiResult,
        language: inputData.preferredLanguage,
        model_name: env.GEMINI_MODEL,
      })
      .select()
      .single();

    if (insertError) {
      logger.error('Error inserting crop recommendation advisory:', insertError);
      sendError(res, 'DB_ERROR', 'Advisory generated but failed to save in history', 500);
      return;
    }

    sendSuccess(res, advisoryRecord, 'Crop recommendations generated successfully', 201);
  } catch (err) {
    logger.error('Exception in cropRecommendation controller:', err);
    sendError(res, 'AI_ERROR', 'Failed to generate crop recommendations. Please check inputs and retry.', 500);
  }
}

/**
 * 2. Multimodal Disease Detection with Leaf Photo Upload
 */
export async function diseaseDetection(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      sendError(res, 'FILE_MISSING', 'A clear photograph of the affected plant leaf/stem is required', 400);
      return;
    }

    const { cropName, symptoms, growthStage, location, preferredLanguage } = req.body;

    logger.info(`Analyzing disease image for crop: ${cropName}, user: ${userId}`);

    // 1. Upload to Supabase Storage in private bucket
    const { path: storagePath, signedUrl } = await uploadCropImage(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname
    );

    // 2. Call Gemini 2.5 Flash Vision Multimodal Analysis
    const aiResult = await GeminiService.analyzeCropDisease(
      {
        cropName,
        symptoms,
        growthStage,
        location,
        preferredLanguage: preferredLanguage || 'en',
      },
      file.buffer,
      file.mimetype
    );

    const title = `${cropName} Health Diagnosis: ${aiResult.possibleConditions[0]?.name || aiResult.assessmentStatus}`;

    // 3. Save to advisories table
    const { data: advisory, error: advError } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        advisory_type: 'disease_detection',
        title,
        input_data: {
          cropName,
          symptoms,
          growthStage,
          location,
          imagePath: storagePath,
        },
        result_data: aiResult,
        language: preferredLanguage || 'en',
        model_name: env.GEMINI_MODEL,
      })
      .select()
      .single();

    if (advError) {
      logger.error('Error saving disease advisory:', advError);
    }

    // 4. Save to disease_analyses dedicated table
    const { data: diseaseRecord, error: disError } = await supabaseAdmin
      .from('disease_analyses')
      .insert({
        user_id: userId,
        advisory_id: advisory?.id || null,
        crop_name: cropName,
        image_path: storagePath,
        symptoms: symptoms || null,
        result_data: aiResult,
      })
      .select()
      .single();

    if (disError) {
      logger.error('Error saving disease_analyses record:', disError);
    }

    sendSuccess(
      res,
      {
        advisory,
        diseaseAnalysis: diseaseRecord,
        imageUrl: signedUrl,
        result: aiResult,
      },
      'Plant health diagnosis completed successfully',
      201
    );
  } catch (err) {
    logger.error('Exception in diseaseDetection controller:', err);
    sendError(res, 'AI_ERROR', 'Failed to diagnose plant pathology. Please provide a clear photograph and retry.', 500);
  }
}

/**
 * 3. Retrieve Disease Analysis by ID with fresh signed URL
 */
export async function getDiseaseDetectionById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { data: analysis, error } = await supabaseAdmin
      .from('disease_analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !analysis) {
      // Check if ID was an advisory ID
      const { data: adv } = await supabaseAdmin
        .from('advisories')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (adv && adv.advisory_type === 'disease_detection') {
        const imagePath = adv.input_data?.imagePath;
        const signedUrl = imagePath ? await getSignedImageUrl(imagePath) : '';
        sendSuccess(res, { advisory: adv, imageUrl: signedUrl, result: adv.result_data });
        return;
      }

      sendError(res, 'NOT_FOUND', 'Disease analysis record not found', 404);
      return;
    }

    const signedUrl = analysis.image_path ? await getSignedImageUrl(analysis.image_path) : '';

    sendSuccess(res, {
      ...analysis,
      imageUrl: signedUrl,
    });
  } catch (err) {
    logger.error('Exception in getDiseaseDetectionById:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to fetch disease analysis', 500);
  }
}

/**
 * 4. Fertilizer Advisory
 */
export async function fertilizerAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const inputData = req.body;

    logger.info(`Generating fertilizer plan for crop: ${inputData.crop}, user: ${userId}`);

    const aiResult = await GeminiService.generateFertilizerAdvisory(inputData);

    const title = `${inputData.crop} Fertilizer Management Plan (${inputData.growthStage})`;

    const { data: advisoryRecord, error } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        advisory_type: 'fertilizer',
        title,
        input_data: inputData,
        result_data: aiResult,
        language: inputData.preferredLanguage,
        model_name: env.GEMINI_MODEL,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error inserting fertilizer advisory:', error);
      sendError(res, 'DB_ERROR', 'Advisory generated but failed to save in history', 500);
      return;
    }

    sendSuccess(res, advisoryRecord, 'Fertilizer advisory generated successfully', 201);
  } catch (err) {
    logger.error('Exception in fertilizerAdvisory controller:', err);
    sendError(res, 'AI_ERROR', 'Failed to calculate fertilizer guidance. Please check inputs and retry.', 500);
  }
}

/**
 * 5. Irrigation Advisory
 */
export async function irrigationAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const inputData = req.body;

    logger.info(`Generating irrigation advisory for crop: ${inputData.crop}, user: ${userId}`);

    const aiResult = await GeminiService.generateIrrigationAdvisory(inputData);

    const title = `${inputData.crop} Irrigation & Water Plan (${inputData.growthStage})`;

    const { data: advisoryRecord, error } = await supabaseAdmin
      .from('advisories')
      .insert({
        user_id: userId,
        advisory_type: 'irrigation',
        title,
        input_data: inputData,
        result_data: aiResult,
        language: inputData.preferredLanguage,
        model_name: env.GEMINI_MODEL,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error inserting irrigation advisory:', error);
      sendError(res, 'DB_ERROR', 'Advisory generated but failed to save in history', 500);
      return;
    }

    sendSuccess(res, advisoryRecord, 'Irrigation advisory generated successfully', 201);
  } catch (err) {
    logger.error('Exception in irrigationAdvisory controller:', err);
    sendError(res, 'AI_ERROR', 'Failed to generate irrigation guidance. Please check inputs and retry.', 500);
  }
}

