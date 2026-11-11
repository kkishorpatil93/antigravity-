import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request completed successfully',
  statusCode = 200
): void {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: unknown
): void {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  res.status(statusCode).json(payload);
}

