import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabaseAdmin, getSignedImageUrl } from '../services/supabase/supabase.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const type = req.query.type as string | undefined;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('advisories')
      .select('id, advisory_type, title, language, model_name, created_at, input_data', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (type) {
      query = query.eq('advisory_type', type);
    }

    const { data: advisories, count, error } = await query;

    if (error) {
      logger.error('Error fetching history:', error);
      sendError(res, 'DB_ERROR', 'Failed to retrieve advisory history', 500);
      return;
    }

    sendSuccess(
      res,
      {
        advisories: advisories || [],
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      'Advisory history retrieved'
    );
  } catch (err) {
    logger.error('Exception in getHistory:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve history', 500);
  }
}

export async function getAdvisoryDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { data: advisory, error } = await supabaseAdmin
      .from('advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !advisory) {
      sendError(res, 'NOT_FOUND', 'Advisory record not found', 404);
      return;
    }

    let imageUrl: string | undefined = undefined;
    if (advisory.advisory_type === 'disease_detection' && advisory.input_data?.imagePath) {
      imageUrl = await getSignedImageUrl(advisory.input_data.imagePath);
    }

    sendSuccess(
      res,
      {
        ...advisory,
        ...(imageUrl ? { imageUrl } : {}),
      },
      'Advisory retrieved successfully'
    );
  } catch (err) {
    logger.error('Exception in getAdvisoryDetail:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve advisory detail', 500);
  }
}

export async function deleteAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('advisories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      logger.error('Error deleting advisory:', error);
      sendError(res, 'DB_ERROR', 'Failed to delete advisory', 500);
      return;
    }

    sendSuccess(res, { deleted: true }, 'Advisory deleted successfully');
  } catch (err) {
    logger.error('Exception in deleteAdvisory:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to delete advisory', 500);
  }
}

