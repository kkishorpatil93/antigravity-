import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

// Supabase Admin Client using Service Role Key (server-side only)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Uploads a validated plant pathology image to private Supabase Storage bucket `crop-images`.
 * Path format: {userId}/{timestamp}-{filename}
 */
export async function uploadCropImage(
  userId: string,
  buffer: Buffer,
  mimeType: string,
  originalName: string
): Promise<{ path: string; signedUrl: string }> {
  try {
    const sanitizedExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('crop-images')
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      logger.error('Failed to upload image to Supabase Storage:', uploadError);
      throw new Error(`Storage upload error: ${uploadError.message}`);
    }

    // Generate signed URL valid for 24 hours (86400 seconds)
    const { data: signedData, error: signError } = await supabaseAdmin.storage
      .from('crop-images')
      .createSignedUrl(filePath, 86400);

    if (signError || !signedData?.signedUrl) {
      logger.error('Failed to generate signed URL for crop image:', signError);
      return { path: filePath, signedUrl: '' };
    }

    return {
      path: filePath,
      signedUrl: signedData.signedUrl,
    };
  } catch (err) {
    logger.error('uploadCropImage exception:', err);
    throw err;
  }
}

/**
 * Retrieve temporary signed URL for existing private image
 */
export async function getSignedImageUrl(filePath: string, expiresIn = 3600): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('crop-images')
      .createSignedUrl(filePath, expiresIn);

    if (error || !data?.signedUrl) {
      return '';
    }
    return data.signedUrl;
  } catch (err) {
    logger.warn(`Could not sign image path ${filePath}:`, err);
    return '';
  }
}

