import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🌾 AgroPulse Crop Advisory Backend Server running on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Gemini AI Model: ${env.GEMINI_MODEL}`);
  logger.info(`Allowed Origin: ${env.FRONTEND_URL}`);
});

// Graceful Shutdown
function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10s timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

