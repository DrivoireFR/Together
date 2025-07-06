import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, rememberMe } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Inscription
router.post('/register', authController.register);

// POST /api/auth/login - Connexion
router.post('/login', authController.login);

// GET /api/auth/verify - Vérifier le token
router.get('/verify', authMiddleware, authController.verifyToken);

// GET /api/auth/remember-me - Vérifier le token remember me
router.get('/remember-me', rememberMe, authController.rememberMeVerify);

export default router;