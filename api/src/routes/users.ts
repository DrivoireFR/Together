import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// GET /api/users - Récupérer tous les utilisateurs (public)
router.get('/', userController.getAllUsers);

// GET /api/users/me - Récupérer le profil de l'utilisateur connecté (protégé)
router.get('/me', authMiddleware, userController.getProfile);

// PUT /api/users/me - Mettre à jour le profil de l'utilisateur connecté (protégé)
router.put('/me', authMiddleware, userController.updateProfile);

// GET /api/users/:id - Récupérer un utilisateur par ID (public)
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Mettre à jour un utilisateur (protégé)
router.put('/:id', authMiddleware, userController.updateUser);

// DELETE /api/users/:id - Supprimer un utilisateur (protégé)
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;