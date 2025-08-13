import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Action } from '../entities/Action';
import { Task } from '../entities/Task';
import { Tag } from '../entities/Tag';
import { AuthRequest } from '../middleware/auth';
import { MoreThanOrEqual } from 'typeorm';
import { frequencyToMonthly } from '../helpers/stats';
import { User } from '../entities/User';

export class StatsController {
  async overview(req: AuthRequest, res: Response) {
    try {
      const { groupId } = req.params;

      if (!groupId) {
        return res.status(400).json({
          message: 'Group ID is required'
        });
      }

      const taskRepository = AppDataSource.getRepository(Task);
      const actionRepository = AppDataSource.getRepository(Action);
      const tagRepository = AppDataSource.getRepository(Tag);
      const userRepository = AppDataSource.getRepository(User);

      // 1. Récupérer les tâches du groupe et calculer le volume mensuel
      const tasks = await taskRepository.find({
        where: { group: { id: parseInt(groupId) } },
        // relations: ['tag']
      });

      const monthlyVolume = tasks.map(task => {
        const monthlyFrequency = frequencyToMonthly(task.frequenceEstimee, task.uniteFrequence);
        return {
          taskId: task.id,
          taskLabel: task.label,
          monthlyFrequency,
          points: task.points,
          monthlyPoints: monthlyFrequency * task.points,
        };
      });

      const totalTasksVolume = monthlyVolume.reduce((sum, task) => sum + task.monthlyPoints, 0);

      // 2. Récupérer les actions depuis le 1er du mois courant
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const users = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.actions', 'action',
          'action.groupId = :groupId AND action.date >= :firstOfMonth',
          { groupId: parseInt(groupId), firstOfMonth }
        )
        .leftJoinAndSelect('action.task', 'task')
        .leftJoinAndSelect('task.tag', 'tag')
        .innerJoin('user.groups', 'group', 'group.id = :groupId', { groupId: parseInt(groupId) })
        .getMany();

      const allActions = users.flatMap(user => user.actions);

      const totalDone = allActions.reduce((acc, action) => {
        return acc + (action.task?.points || 0);
      }, 0);

      res.json({
        message: 'Overview récupéré avec succès',
        overview: {
          totalTasksVolume,
          totalDone,
          actions: allActions,
          users,
          tasks,
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'overview:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}