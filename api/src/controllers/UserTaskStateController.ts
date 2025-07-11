import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserTaskState } from '../entities/UserTaskState';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';

export class UserTaskStateController {
  async updateTaskState(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const { isAcknowledged, isConcerned } = req.body;
      const userId = req.user!.id;

      if (isAcknowledged === undefined && isConcerned === undefined) {
        return res.status(400).json({
          message: 'Au moins un des champs isAcknowledged ou isConcerned doit être fourni'
        });
      }

      const userTaskStateRepository = AppDataSource.getRepository(UserTaskState);
      const taskRepository = AppDataSource.getRepository(Task);
      const userRepository = AppDataSource.getRepository(User);

      // Vérifier si la tâche existe
      const task = await taskRepository.findOne({ where: { id: parseInt(taskId) } });
      if (!task) {
        return res.status(404).json({
          message: 'Tâche non trouvée'
        });
      }

      // Vérifier si l'utilisateur existe
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      // Chercher ou créer l'état existant
      let userTaskState = await userTaskStateRepository.findOne({
        where: { user: { id: userId }, task: { id: parseInt(taskId) } },
        relations: ['user', 'task']
      });

      if (!userTaskState) {
        // Créer un nouvel état
        userTaskState = new UserTaskState();
        userTaskState.user = user;
        userTaskState.task = task;
      }

      // Mettre à jour les champs demandés
      if (isAcknowledged !== undefined) {
        userTaskState.isAcknowledged = isAcknowledged;
        userTaskState.acknowledgedAt = isAcknowledged ? new Date() : undefined;
      }

      if (isConcerned !== undefined) {
        userTaskState.isConcerned = isConcerned;
        userTaskState.concernedAt = isConcerned ? new Date() : undefined;
      }

      await userTaskStateRepository.save(userTaskState);

      res.json({
        message: 'État de la tâche mis à jour avec succès',
        userTaskState: {
          id: userTaskState.id,
          taskId: userTaskState.task.id,
          userId: userTaskState.user.id,
          isAcknowledged: userTaskState.isAcknowledged,
          isConcerned: userTaskState.isConcerned,
          acknowledgedAt: userTaskState.acknowledgedAt,
          concernedAt: userTaskState.concernedAt,
          createdAt: userTaskState.createdAt,
          updatedAt: userTaskState.updatedAt
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getUserTaskStates(req: AuthRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const userId = req.user!.id;

      const userTaskStateRepository = AppDataSource.getRepository(UserTaskState);
      
      const userTaskStates = await userTaskStateRepository.find({
        where: { 
          user: { id: userId },
          task: { group: { id: parseInt(groupId) } }
        },
        relations: ['user', 'task']
      });

      res.json({
        message: 'États des tâches récupérés avec succès',
        userTaskStates: userTaskStates.map((state: UserTaskState) => ({
          id: state.id,
          taskId: state.task.id,
          userId: state.user.id,
          isAcknowledged: state.isAcknowledged,
          isConcerned: state.isConcerned,
          acknowledgedAt: state.acknowledgedAt,
          concernedAt: state.concernedAt,
          createdAt: state.createdAt,
          updatedAt: state.updatedAt
        }))
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des états des tâches:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}