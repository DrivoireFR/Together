import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Action } from '../entities/Action';
import { Task } from '../entities/Task';
import { Tag } from '../entities/Tag';
import { AuthRequest } from '../middleware/auth';
import { MoreThanOrEqual } from 'typeorm';
import { frequencyToMonthly } from '../helpers/stats';

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

      // 1. Récupérer les tâches du groupe et calculer le volume mensuel
      const tasks = await taskRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['tag']
      });

      const monthlyVolume = tasks.map(task => {
        const monthlyFrequency = frequencyToMonthly(task.frequenceEstimee, task.uniteFrequence);
        return {
          taskId: task.id,
          taskLabel: task.label,
          monthlyFrequency,
          points: task.points,
          monthlyPoints: monthlyFrequency * task.points,
          tag: task.tag ? {
            id: task.tag.id,
            label: task.tag.label,
            color: task.tag.color
          } : null
        };
      });

      const totalTasksVolume = monthlyVolume.reduce((sum, task) => sum + task.monthlyPoints, 0);

      // 2. Récupérer les actions depuis le 1er du mois courant
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const actionsThisMonth = await actionRepository.find({
        where: {
          group: { id: parseInt(groupId) },
          date: MoreThanOrEqual(firstOfMonth)
        },
        relations: ['user', 'task', 'task.tag'],
        order: { date: 'ASC' }
      });

      // Grouper les actions par jour et par personne
      const actionsByDayAndUser = actionsThisMonth.reduce((acc, action) => {
        const dayKey = action.date.toISOString().split('T')[0]; // YYYY-MM-DD
        const userId = action.user.id;

        if (!acc[dayKey]) {
          acc[dayKey] = {};
        }

        if (!acc[dayKey][userId]) {
          acc[dayKey][userId] = {
            userName: action.user.prenom + ' ' + action.user.nom,
            actions: []
          };
        }

        acc[dayKey][userId].actions.push({
          id: action.id,
          taskLabel: action.task.label,
          points: action.task.points,
          isHelpingHand: action.isHelpingHand,
          tag: action.task.tag ? {
            id: action.task.tag.id,
            label: action.task.tag.label,
            color: action.task.tag.color
          } : null
        });

        return acc;
      }, {} as Record<string, Record<number, { userName: string; actions: any[] }>>);

      // 3. Lister les actions "coups de main" par personne
      const helpingHandActions = actionsThisMonth.filter(action => action.isHelpingHand);
      const helpingHandByUser = helpingHandActions.reduce((acc, action) => {
        const userId = action.user.id;
        const userName = action.user.prenom + ' ' + action.user.nom;

        if (!acc[userId]) {
          acc[userId] = {
            userName,
            helpingHands: []
          };
        }

        acc[userId].helpingHands.push({
          id: action.id,
          date: action.date,
          taskLabel: action.task.label,
          points: action.task.points,
          tag: action.task.tag ? {
            id: action.task.tag.id,
            label: action.task.tag.label,
            color: action.task.tag.color
          } : null
        });

        return acc;
      }, {} as Record<number, { userName: string; helpingHands: any[] }>);

      // 4. Actions par catégorie + volume total par catégorie
      const tags = await tagRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['tasks']
      });

      const actionsByCategory = tags.map(tag => {
        const tagTasks = tasks.filter(task => task.tag?.id === tag.id);
        const tagActions = actionsThisMonth.filter(action => action.task.tag?.id === tag.id);

        const totalVolumeForCategory = tagTasks.reduce((sum, task) => {
          const monthlyFrequency = frequencyToMonthly(task.frequenceEstimee, task.uniteFrequence);
          return sum + (monthlyFrequency * task.points);
        }, 0);

        const completedActionsForCategory = tagActions.reduce((sum, action) => {
          return sum + action.task.points;
        }, 0);

        return {
          tagId: tag.id,
          tagLabel: tag.label,
          tagColor: tag.color,
          totalMonthlyVolume: totalVolumeForCategory,
          completedThisMonth: completedActionsForCategory,
          completionPercentage: totalVolumeForCategory > 0 ?
            Math.round((completedActionsForCategory / totalVolumeForCategory) * 100) : 0,
          actionsCount: tagActions.length,
          tasksInCategory: tagTasks.length
        };
      });

      // Actions sans catégorie
      const tasksWithoutTag = tasks.filter(task => !task.tag);
      const actionsWithoutTag = actionsThisMonth.filter(action => !action.task.tag);

      const totalVolumeWithoutTag = tasksWithoutTag.reduce((sum, task) => {
        const monthlyFrequency = frequencyToMonthly(task.frequenceEstimee, task.uniteFrequence);
        return sum + (monthlyFrequency * task.points);
      }, 0);

      const completedActionsWithoutTag = actionsWithoutTag.reduce((sum, action) => {
        return sum + action.task.points;
      }, 0);

      if (tasksWithoutTag.length > 0) {
        actionsByCategory.push({
          tagId: null as any,
          tagLabel: 'Sans catégorie',
          tagColor: '#808080',
          totalMonthlyVolume: totalVolumeWithoutTag,
          completedThisMonth: completedActionsWithoutTag,
          completionPercentage: totalVolumeWithoutTag > 0 ?
            Math.round((completedActionsWithoutTag / totalVolumeWithoutTag) * 100) : 0,
          actionsCount: actionsWithoutTag.length,
          tasksInCategory: tasksWithoutTag.length
        });
      }

      res.json({
        message: 'Overview récupéré avec succès',
        overview: {
          monthlyVolume,
          actionsByDayAndUser,
          helpingHandByUser,
          actionsByCategory,
          summary: {
            totalTasksVolume,
            totalTasksInGroup: tasks.length,
            totalActionsThisMonth: actionsThisMonth.length,
            totalHelpingHands: helpingHandActions.length,
            totalMontlyActionVolume: actionsThisMonth.reduce((sum, action) => sum + action.task.points, 0),
            totalMonthlyVolumeAllCategories: actionsByCategory.reduce((sum, cat) => sum + cat.totalMonthlyVolume, 0),
            totalCompletedThisMonth: actionsByCategory.reduce((sum, cat) => sum + cat.completedThisMonth, 0)
          }
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