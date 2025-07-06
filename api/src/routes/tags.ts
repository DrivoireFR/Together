import { Router } from 'express';
import { TagController } from '../controllers/TagController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const tagController = new TagController();

// POST /api/tags - Créer un tag
router.post('/', authMiddleware, tagController.create);

// GET /api/tags - Récupérer tous les tags
router.get('/', authMiddleware, tagController.getAll);

// GET /api/tags/:id - Récupérer un tag par ID
router.get('/:id', authMiddleware, tagController.getById);

// PUT /api/tags/:id - Mettre à jour un tag
router.put('/:id', authMiddleware, tagController.update);

// DELETE /api/tags/:id - Supprimer un tag
router.delete('/:id', authMiddleware, tagController.delete);

export default router;