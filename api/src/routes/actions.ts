import { Router } from 'express';
import { ActionController } from '../controllers/ActionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const actionController = new ActionController();

// POST /api/actions - Créer une action
router.post('/', authMiddleware, actionController.create);

// GET /api/actions - Récupérer toutes les actions
router.get('/', authMiddleware, actionController.getAll);

// GET /api/actions/me - Récupérer mes actions
router.get('/me', authMiddleware, actionController.getMyActions);

// GET /api/actions/statistics - Récupérer les statistiques
router.get('/statistics', authMiddleware, actionController.getStatistics);

// GET /api/actions/user/:userId - Récupérer les actions d'un utilisateur
router.get('/user/:userId', authMiddleware, actionController.getByUserId);

// GET /api/actions/group/:groupId - Récupérer les actions d'un groupe
router.get('/group/:groupId', authMiddleware, actionController.getByGroupId);

// GET /api/actions/task/:taskId - Récupérer les actions d'une tâche
router.get('/task/:taskId', authMiddleware, actionController.getByTaskId);

// GET /api/actions/:id - Récupérer une action par ID
router.get('/:id', authMiddleware, actionController.getById);

// PUT /api/actions/:id - Mettre à jour une action
router.put('/:id', authMiddleware, actionController.update);

// DELETE /api/actions/:id - Supprimer une action
router.delete('/:id', authMiddleware, actionController.delete);

export default router;