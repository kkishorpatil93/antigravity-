import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 mins
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(60),
  MAX_IMAGE_SIZE_MB: z.coerce.number().default(5),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errorDetails = parsedEnv.error.format();
  console.error('❌ FATAL: Environment variable validation failed:');
  console.error(JSON.stringify(errorDetails, null, 2));
  // In development, provide friendly fallback warnings if credentials are being configured
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Please ensure all required variables are set in your backend .env file.');
  }
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      PORT: Number(process.env.PORT) || 5000,
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
      SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'placeholder_anon_key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'placeholder_gemini_key',
      GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
      MAX_IMAGE_SIZE_MB: Number(process.env.MAX_IMAGE_SIZE_MB) || 5,
    };

