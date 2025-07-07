import { Router } from 'express';
import { AchievementController } from '../controllers/AchievementController';

const router = Router();
const achievementController = new AchievementController();

// GET /api/achievements - Récupérer tous les achievements
router.get('/', (req, res) => achievementController.getAll(req, res));

// GET /api/achievements/:id - Récupérer un achievement par ID
router.get('/:id', (req, res) => achievementController.getById(req, res));

// GET /api/achievements/user/:userId - Récupérer les achievements d'un utilisateur
router.get('/user/:userId', (req, res) => achievementController.getByUser(req, res));

// GET /api/achievements/user/:userId/stats - Récupérer les statistiques d'un utilisateur
router.get('/user/:userId/stats', (req, res) => achievementController.getStats(req, res));

// GET /api/achievements/group/:groupId - Récupérer les achievements d'un groupe
router.get('/group/:groupId', (req, res) => achievementController.getByGroup(req, res));

// POST /api/achievements - Créer un nouvel achievement
router.post('/', (req, res) => achievementController.create(req, res));

// DELETE /api/achievements/:id - Supprimer un achievement
router.delete('/:id', (req, res) => achievementController.delete(req, res));

export default router;