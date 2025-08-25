import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Action } from '../entities/Action';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { UserTaskState } from '../entities/UserTaskState';
import { AuthRequest } from '../middleware/auth';
import { MoreThanOrEqual } from 'typeorm';
import { frequencyToMonthly } from '../helpers/stats';

export class ActionController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { taskId, date } = req.body;
      const userId = req.user!.id;

      if (!taskId || !date) {
        return res.status(400).json({
          message: 'Tâche et date requis'
        });
      }

      const actionRepository = AppDataSource.getRepository(Action);
      const taskRepository = AppDataSource.getRepository(Task);
      const userRepository = AppDataSource.getRepository(User);
      const userTaskStateRepository = AppDataSource.getRepository(UserTaskState);

      // Vérifier si la tâche existe
      const task = await taskRepository.findOne({
        where: { id: taskId },
        relations: ['group']
      });

      if (!task) {
        return res.status(404).json({
          message: 'Tâche non trouvée'
        });
      }

      // Vérifier si l'utilisateur existe
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['groups']
      });

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe de la tâche
      const isMemberOfGroup = user.groups.some(group => group.id === task.group.id);
      if (!isMemberOfGroup) {
        return res.status(403).json({
          message: 'Vous n\'êtes pas membre du groupe de cette tâche'
        });
      }

      // Vérifier si l'utilisateur est concerné par la tâche
      const userTaskState = await userTaskStateRepository.findOne({
        where: {
          user: { id: userId },
          task: { id: taskId }
        }
      });

      const isUserConcerned = userTaskState?.isConcerned || false;

      // Créer l'action
      const action = new Action();
      action.task = task;
      action.user = user;
      action.group = task.group;
      action.date = new Date(date);
      action.isHelpingHand = !isUserConcerned; // Si l'utilisateur n'est pas concerné, c'est un coup de main

      // Valider les données
      const errors = await validate(action);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await actionRepository.save(action);

      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const userActions = await actionRepository.find({
        where: {
          user: { id: userId },
          date: MoreThanOrEqual(firstOfMonth)
        },
        relations: ['task']
      });

      const totalDone: number = userActions.reduce((acc, action) => {
        return acc + action.task.points;
      }, 0);

      res.status(201).json({
        message: 'Action créée avec succès',
        action,
        totalDone
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'action:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const actionRepository = AppDataSource.getRepository(Action);
      const actions = await actionRepository.find({
        relations: ['task', 'user', 'group']
      });

      res.json({
        message: 'Actions récupérées avec succès',
        actions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des actions:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const actionRepository = AppDataSource.getRepository(Action);

      const action = await actionRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['task', 'user', 'group']
      });

      if (!action) {
        return res.status(404).json({
          message: 'Action non trouvée'
        });
      }

      res.json({
        message: 'Action récupérée avec succès',
        action
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'action:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getByUserId = async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const actionRepository = AppDataSource.getRepository(Action);

      const actions = await actionRepository.find({
        where: { user: { id: parseInt(userId) } },
        relations: ['task', 'user', 'group']
      });

      res.json({
        message: 'Actions de l\'utilisateur récupérées avec succès',
        actions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des actions de l\'utilisateur:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getByGroupId = async (req: AuthRequest, res: Response) => {
    try {
      const { groupId } = req.params;
      const actionRepository = AppDataSource.getRepository(Action);

      const actions = await actionRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['task', 'user', 'group']
      });

      res.json({
        message: 'Actions du groupe récupérées avec succès',
        actions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des actions du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getRecentByGroupId = async (req: AuthRequest, res: Response) => {
    try {
      const { groupId } = req.params;
      const actionRepository = AppDataSource.getRepository(Action);

      const actions = await actionRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['task', 'user', 'group'],
        order: { createdAt: 'DESC' },
        take: 50
      });

      res.json({
        message: '50 dernières actions du groupe récupérées avec succès',
        actions,
        total: actions.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières actions du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }



  getByTaskId = async (req: AuthRequest, res: Response) => {
    try {
      const { taskId } = req.params;
      const actionRepository = AppDataSource.getRepository(Action);

      const actions = await actionRepository.find({
        where: { task: { id: parseInt(taskId) } },
        relations: ['task', 'user', 'group']
      });

      res.json({
        message: 'Actions de la tâche récupérées avec succès',
        actions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des actions de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getMyActions = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const actionRepository = AppDataSource.getRepository(Action);

      const actions = await actionRepository.find({
        where: { user: { id: userId } },
        relations: ['task', 'user', 'group']
      });

      res.json({
        message: 'Mes actions récupérées avec succès',
        actions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de mes actions:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const userId = req.user!.id;

      const actionRepository = AppDataSource.getRepository(Action);

      const action = await actionRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['task', 'user', 'group']
      });

      if (!action) {
        return res.status(404).json({
          message: 'Action non trouvée'
        });
      }

      // Vérifier si l'utilisateur est le propriétaire de l'action
      if (action.user.id !== userId) {
        return res.status(403).json({
          message: 'Vous ne pouvez modifier que vos propres actions'
        });
      }

      // Mettre à jour la date
      if (date) action.date = new Date(date);

      // Valider les données
      const errors = await validate(action);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await actionRepository.save(action);

      res.json({
        message: 'Action mise à jour avec succès',
        action
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'action:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const actionRepository = AppDataSource.getRepository(Action);

      const action = await actionRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['task', 'user', 'group']
      });

      if (!action) {
        return res.status(404).json({
          message: 'Action non trouvée'
        });
      }

      // Vérifier si l'utilisateur est le propriétaire de l'action
      if (action.user.id !== userId) {
        return res.status(403).json({
          message: 'Vous ne pouvez supprimer que vos propres actions'
        });
      }

      await actionRepository.remove(action);

      res.json({
        message: 'Action supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'action:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}