import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

// POST /api/tasks - Créer une tâche
router.post('/', authMiddleware, taskController.create);

// GET /api/tasks - Récupérer toutes les tâches
router.get('/', authMiddleware, taskController.getAll);

// GET /api/tasks/:id - Récupérer une tâche par ID
router.get('/:id', authMiddleware, taskController.getById);

// PUT /api/tasks/:id - Mettre à jour une tâche
router.put('/:id', authMiddleware, taskController.update);

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/:id', authMiddleware, taskController.delete);

export default router;