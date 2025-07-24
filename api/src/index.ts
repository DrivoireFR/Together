import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import tagRoutes from './routes/tags';
import groupRoutes from './routes/groups';
import taskRoutes from './routes/tasks';
import actionRoutes from './routes/actions';
import userTaskStateRoutes from './routes/userTaskStates';
import statsRoutes from './routes/statistics';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/user-task-states', userTaskStateRoutes);
app.use('/api/stats', statsRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestion globale des erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialisation de la base de données et démarrage du serveur
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🌐 API accessible sur: http://localhost:${PORT}`);
      console.log(`📋 Route de santé: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Routes d'authentification: http://localhost:${PORT}/api/auth`);
      console.log(`👥 Routes utilisateurs: http://localhost:${PORT}/api/users`);
      console.log(`🏷️  Routes tags: http://localhost:${PORT}/api/tags`);
      console.log(`👥 Routes groupes: http://localhost:${PORT}/api/groups`);
      console.log(`📋 Routes tâches: http://localhost:${PORT}/api/tasks`);
      console.log(`⚡ Routes actions: http://localhost:${PORT}/api/actions`);
      console.log(`📋 Routes états tâches: http://localhost:${PORT}/api/user-task-states`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();