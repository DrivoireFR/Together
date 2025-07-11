import { Router } from 'express';
import { UserTaskStateController } from '../controllers/UserTaskStateController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userTaskStateController = new UserTaskStateController();

// PUT /api/user-task-states/:taskId - Mettre à jour l'état d'une tâche pour l'utilisateur
router.put('/:taskId', authMiddleware, userTaskStateController.updateTaskState);

// GET /api/user-task-states/group/:groupId - Récupérer les états des tâches d'un groupe pour l'utilisateur
router.get('/group/:groupId', authMiddleware, userTaskStateController.getUserTaskStates);

export default router;