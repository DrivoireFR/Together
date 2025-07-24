import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const statisticsController = new StatsController();

router.get('/group/:groupId/overview', authMiddleware, statisticsController.overview);

export default router;