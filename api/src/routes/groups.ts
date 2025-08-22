import { Router } from 'express';
import { GroupController } from '../controllers/GroupController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const groupController = new GroupController();

// POST /api/groups - Créer un groupe
router.post('/', authMiddleware, groupController.create);

// GET /api/groups - Récupérer tous les groupes
router.get('/', authMiddleware, groupController.getAll);

// GET /api/groups/search/name - Rechercher des groupes par nom
router.get('/search/name', authMiddleware, groupController.searchByName);

// GET /api/groups/search/email - Rechercher des groupes par email d'un membre
router.get('/search/email', authMiddleware, groupController.searchByUserEmail);

// GET /api/groups/user/:userId - Récupérer les groupes d'un utilisateur
router.get('/user/:userId', authMiddleware, groupController.getUserGroups);

// GET /api/groups/:id - Récupérer un groupe par ID
router.get('/:id', authMiddleware, groupController.getById);

// PUT /api/groups/:id - Mettre à jour un groupe
router.put('/:id', authMiddleware, groupController.update);

// DELETE /api/groups/:id - Supprimer un groupe
router.delete('/:id', authMiddleware, groupController.delete);

// POST /api/groups/:id/join - Rejoindre un groupe
router.post('/:id/join', authMiddleware, groupController.joinGroup);

// POST /api/groups/:id/leave - Quitter un groupe
router.post('/:id/leave', authMiddleware, groupController.leaveGroup);

// POST /api/groups/:id/tags - Ajouter des tags en bulk à un groupe
router.post('/:id/tags', authMiddleware, groupController.addTags);

// POST /api/groups/:id/tasks - Ajouter des tâches en bulk à un groupe
router.post('/:id/tasks', authMiddleware, groupController.addTasks);

export default router;