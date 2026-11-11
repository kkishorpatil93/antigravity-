import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdmin } from '../services/supabase/supabase.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const { data: profile, error } = await supabaseAdmin
      .from('farmer_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching profile:', error);
      sendError(res, 'DB_ERROR', 'Failed to retrieve farmer profile', 500);
      return;
    }

    if (!profile) {
      // Auto-create basic profile fallback if trigger hadn't populated it
      const defaultProfile = {
        id: userId,
        full_name: req.user!.user_metadata?.full_name || req.user!.email?.split('@')[0] || 'Farmer',
        preferred_language: 'en',
      };
      const { data: created, error: createError } = await supabaseAdmin
        .from('farmer_profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (createError) {
        logger.error('Error auto-creating profile:', createError);
        sendError(res, 'DB_ERROR', 'Failed to initialize profile', 500);
        return;
      }
      sendSuccess(res, created, 'Farmer profile retrieved');
      return;
    }

    sendSuccess(res, profile, 'Farmer profile retrieved successfully');
  } catch (err) {
    logger.error('Exception in getProfile:', err);
    sendError(res, 'INTERNAL_ERROR', 'Internal error retrieving profile', 500);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const updateData = req.body;

    const { data: updated, error } = await supabaseAdmin
      .from('farmer_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating profile:', error);
      sendError(res, 'DB_ERROR', 'Failed to update farmer profile', 500);
      return;
    }

    sendSuccess(res, updated, 'Farmer profile updated successfully');
  } catch (err) {
    logger.error('Exception in updateProfile:', err);
    sendError(res, 'INTERNAL_ERROR', 'Internal error updating profile', 500);
  }
}

