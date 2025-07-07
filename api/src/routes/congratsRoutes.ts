import { Router } from 'express';
import { CongratsController } from '../controllers/CongratsController';

const router = Router();
const congratsController = new CongratsController();

// GET /api/congrats - Récupérer tous les congrats
router.get('/', (req, res) => congratsController.getAll(req, res));

// GET /api/congrats/:id - Récupérer un congrats par ID
router.get('/:id', (req, res) => congratsController.getById(req, res));

// GET /api/congrats/tag/:tagId - Récupérer les congrats d'un tag
router.get('/tag/:tagId', (req, res) => congratsController.getByTag(req, res));

// POST /api/congrats - Créer un nouveau congrats
router.post('/', (req, res) => congratsController.create(req, res));

// PUT /api/congrats/:id - Mettre à jour un congrats
router.put('/:id', (req, res) => congratsController.update(req, res));

// DELETE /api/congrats/:id - Supprimer un congrats
router.delete('/:id', (req, res) => congratsController.delete(req, res));

export default router;