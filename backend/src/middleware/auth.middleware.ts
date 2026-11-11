import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../services/supabase/supabase.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'UNAUTHORIZED', 'Missing or malformed Authorization header with Bearer token', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendError(res, 'UNAUTHORIZED', 'Bearer token is missing', 401);
      return;
    }

    // Verify token with Supabase Auth
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn('Token validation failed:', error?.message);
      sendError(res, 'UNAUTHORIZED', 'Invalid or expired session token', 401);
      return;
    }

    // Attach authenticated user to request context
    req.user = user;
    next();
  } catch (err) {
    logger.error('Unexpected error in auth middleware:', err);
    sendError(res, 'AUTH_ERROR', 'Authentication verification failed', 401);
  }
}

