import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Task, FrequencyUnit } from '../entities/Task';
import { Group } from '../entities/Group';
import { Tag } from '../entities/Tag';
import { AuthRequest } from '../middleware/auth';

export class TaskController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { label, iconUrl, frequenceEstimee, uniteFrequence, groupId, tagId, points } = req.body;

      if (!label || !frequenceEstimee || !groupId) {
        return res.status(400).json({
          message: 'Label, fréquence estimée et groupe requis'
        });
      }

      const taskRepository = AppDataSource.getRepository(Task);
      const groupRepository = AppDataSource.getRepository(Group);
      const tagRepository = AppDataSource.getRepository(Tag);

      // Vérifier si le groupe existe
      const group = await groupRepository.findOne({ where: { id: groupId } });
      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si le tag existe (optionnel)
      let tag: Tag | undefined = undefined;
      if (tagId) {
        const foundTag = await tagRepository.findOne({
          where: { id: tagId },
          relations: ['group']
        });
        if (!foundTag) {
          return res.status(404).json({
            message: 'Tag non trouvé'
          });
        }

        // Vérifier que le tag appartient au même groupe que la tâche
        if (foundTag.group.id !== groupId) {
          return res.status(400).json({
            message: 'Le tag doit appartenir au même groupe que la tâche'
          });
        }

        tag = foundTag;
      }

      // Créer la tâche
      const task = new Task();
      task.label = label;
      task.iconUrl = iconUrl;
      task.frequenceEstimee = frequenceEstimee;
      task.uniteFrequence = uniteFrequence || FrequencyUnit.SEMAINE;
      task.group = group;
      task.tag = tag;
      task.points = points;

      // Valider les données
      const errors = await validate(task);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await taskRepository.save(task);

      res.status(201).json({
        message: 'Tâche créée avec succès',
        task
      });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      const tasks = await taskRepository.find({
        relations: ['group', 'tag', 'actions']
      });

      res.json({
        message: 'Tâches récupérées avec succès',
        tasks
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const taskRepository = AppDataSource.getRepository(Task);

      const task = await taskRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['group', 'tag', 'actions']
      });

      if (!task) {
        return res.status(404).json({
          message: 'Tâche non trouvée'
        });
      }

      res.json({
        message: 'Tâche récupérée avec succès',
        task
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getByGroupId(req: AuthRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const userId = req.user!.id;
      const taskRepository = AppDataSource.getRepository(Task);

      const tasks = await taskRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['group', 'tag', 'actions', 'userStates', 'userStates.user']
      });

      // Enrichir les tâches avec l'état de l'utilisateur actuel
      const tasksWithUserState = tasks.map((task: Task) => {
        const userTaskState = task.userStates?.find(state => state.user.id === userId);
        return {
          ...task,
          userTaskState: userTaskState ? {
            id: userTaskState.id,
            isAcknowledged: userTaskState.isAcknowledged,
            isConcerned: userTaskState.isConcerned,
            acknowledgedAt: userTaskState.acknowledgedAt,
            concernedAt: userTaskState.concernedAt,
            createdAt: userTaskState.createdAt,
            updatedAt: userTaskState.updatedAt
          } : null,
          // Supprimer la relation userStates du JSON de réponse pour éviter la surcharge
          userStates: undefined
        };
      });

      res.json({
        message: 'Tâches du groupe récupérées avec succès',
        tasks: tasksWithUserState
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { label, iconUrl, frequenceEstimee, uniteFrequence, tagId } = req.body;

      const taskRepository = AppDataSource.getRepository(Task);
      const tagRepository = AppDataSource.getRepository(Tag);

      const task = await taskRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['group', 'tag']
      });

      if (!task) {
        return res.status(404).json({
          message: 'Tâche non trouvée'
        });
      }

      // Vérifier si le tag existe (optionnel)
      let tag: Tag | undefined = undefined;
      if (tagId) {
        const foundTag = await tagRepository.findOne({
          where: { id: tagId },
          relations: ['group']
        });
        if (!foundTag) {
          return res.status(404).json({
            message: 'Tag non trouvé'
          });
        }

        // Vérifier que le tag appartient au même groupe que la tâche
        if (foundTag.group.id !== task.group.id) {
          return res.status(400).json({
            message: 'Le tag doit appartenir au même groupe que la tâche'
          });
        }

        tag = foundTag;
      }

      // Mettre à jour les champs
      if (label) task.label = label;
      if (iconUrl !== undefined) task.iconUrl = iconUrl;
      if (frequenceEstimee) task.frequenceEstimee = frequenceEstimee;
      if (uniteFrequence) task.uniteFrequence = uniteFrequence;
      if (tagId !== undefined) task.tag = tag;

      // Valider les données
      const errors = await validate(task);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await taskRepository.save(task);

      res.json({
        message: 'Tâche mise à jour avec succès',
        task
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const taskRepository = AppDataSource.getRepository(Task);

      const task = await taskRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['actions']
      });

      if (!task) {
        return res.status(404).json({
          message: 'Tâche non trouvée'
        });
      }

      // Vérifier si la tâche a des actions
      if (task.actions && task.actions.length > 0) {
        return res.status(400).json({
          message: 'Impossible de supprimer la tâche car elle contient des actions'
        });
      }

      await taskRepository.remove(task);

      res.json({
        message: 'Tâche supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}