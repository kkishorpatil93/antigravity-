import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  logger.error('Unhandled request exception:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      sendError(res, 'FILE_TOO_LARGE', `Uploaded file exceeds maximum limit of ${env.MAX_IMAGE_SIZE_MB}MB`, 400);
      return;
    }
    sendError(res, 'UPLOAD_ERROR', err.message, 400);
    return;
  }

  // Handle standard generic errors
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred while processing your agricultural advisory'
      : err.message || 'Internal server error';

  sendError(res, 'INTERNAL_SERVER_ERROR', message, 500);
}

