import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { env } from '../config/env.js';

const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are supported.`
      )
    );
  }
}

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter,
});

