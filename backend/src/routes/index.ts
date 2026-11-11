import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import advisoryRoutes from './advisory.routes.js';
import assistantRoutes from './assistant.routes.js';
import historyRoutes from './history.routes.js';
import accountRoutes from './account.routes.js';
import { sendSuccess } from '../utils/response.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  sendSuccess(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AgroPulse Crop Advisory Backend',
    },
    'Server is healthy and ready'
  );
});

apiRouter.use('/profile', profileRoutes);
apiRouter.use('/advisory', advisoryRoutes);
apiRouter.use('/assistant', assistantRoutes);
apiRouter.use('/history', historyRoutes);
apiRouter.use('/account', accountRoutes);

export default apiRouter;

