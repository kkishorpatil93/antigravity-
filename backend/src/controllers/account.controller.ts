import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdmin } from '../services/supabase/supabase.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    logger.info(`Processing account deletion request for user ${userId}`);

    // 1. Delete user files from Supabase Storage bucket
    try {
      const { data: userFiles } = await supabaseAdmin.storage
        .from('crop-images')
        .list(userId);

      if (userFiles && userFiles.length > 0) {
        const filePaths = userFiles.map((f) => `${userId}/${f.name}`);
        await supabaseAdmin.storage.from('crop-images').remove(filePaths);
      }
    } catch (storageErr) {
      logger.warn('Non-fatal warning cleaning user storage:', storageErr);
    }

    // 2. Delete user from auth.users (cascades to farmer_profiles, advisories, etc.)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      logger.error('Failed to delete auth user:', deleteError);
      sendError(res, 'AUTH_ERROR', 'Failed to complete account deletion', 500);
      return;
    }

    sendSuccess(res, { deleted: true }, 'Farmer account and all associated data permanently deleted');
  } catch (err) {
    logger.error('Exception in deleteAccount:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to execute account deletion', 500);
  }
}

