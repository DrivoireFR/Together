import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Achievement } from '../entities/Achievement';
import { User } from '../entities/User';
import { Congrats } from '../entities/Congrats';
import { Group } from '../entities/Group';

export class AchievementController {
  private achievementRepository = AppDataSource.getRepository(Achievement);
  private userRepository = AppDataSource.getRepository(User);
  private congratsRepository = AppDataSource.getRepository(Congrats);
  private groupRepository = AppDataSource.getRepository(Group);

  async getAll(req: Request, res: Response) {
    try {
      const achievements = await this.achievementRepository.find({
        relations: ['user', 'group', 'congrats', 'congrats.tag']
      });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des achievements' });
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const achievements = await this.achievementRepository.find({
        where: { user: { id: parseInt(userId) } },
        relations: ['group', 'congrats', 'congrats.tag'],
        order: { achievedAt: 'DESC' }
      });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des achievements de l\'utilisateur' });
    }
  }

  async getByGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const achievements = await this.achievementRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['user', 'congrats', 'congrats.tag'],
        order: { achievedAt: 'DESC' }
      });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des achievements du groupe' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const achievement = await this.achievementRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['user', 'group', 'congrats', 'congrats.tag']
      });

      if (!achievement) {
        return res.status(404).json({ message: 'Achievement non trouvé' });
      }

      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'achievement' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { userId, groupId, congratsId, achievedAt } = req.body;

      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const group = await this.groupRepository.findOne({
        where: { id: groupId }
      });

      if (!group) {
        return res.status(404).json({ message: 'Groupe non trouvé' });
      }

      const congrats = await this.congratsRepository.findOne({
        where: { id: congratsId }
      });

      if (!congrats) {
        return res.status(404).json({ message: 'Congrats non trouvé' });
      }

      // Vérifier si l'achievement existe déjà pour cet utilisateur, ce groupe et ce congrats
      const existingAchievement = await this.achievementRepository.findOne({
        where: { user: { id: userId }, group: { id: groupId }, congrats: { id: congratsId } }
      });

      if (existingAchievement) {
        return res.status(400).json({ message: 'Achievement déjà attribué à cet utilisateur pour ce groupe' });
      }

      const achievement = this.achievementRepository.create({
        user,
        group,
        congrats,
        achievedAt: achievedAt ? new Date(achievedAt) : new Date()
      });

      const savedAchievement = await this.achievementRepository.save(achievement);
      
      // Récupérer l'achievement complet avec ses relations
      const completeAchievement = await this.achievementRepository.findOne({
        where: { id: savedAchievement.id },
        relations: ['user', 'group', 'congrats', 'congrats.tag']
      });

      res.status(201).json(completeAchievement);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'achievement' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.achievementRepository.delete(parseInt(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Achievement non trouvé' });
      }

      res.json({ message: 'Achievement supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'achievement' });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { groupId } = req.query; // Optionnel : filtrer par groupe
      
      const whereCondition: any = { user: { id: parseInt(userId) } };
      if (groupId) {
        whereCondition.group = { id: parseInt(groupId as string) };
      }

      const achievements = await this.achievementRepository.find({
        where: whereCondition,
        relations: ['group', 'congrats', 'congrats.tag']
      });

      // Statistiques par tag
      const statsByTag = achievements.reduce((acc, achievement) => {
        const tagLabel = achievement.congrats.tag.label;
        if (!acc[tagLabel]) {
          acc[tagLabel] = { level1: 0, level2: 0, total: 0 };
        }
        if (achievement.congrats.level === 1) {
          acc[tagLabel].level1++;
        } else if (achievement.congrats.level === 2) {
          acc[tagLabel].level2++;
        }
        acc[tagLabel].total++;
        return acc;
      }, {} as Record<string, { level1: number; level2: number; total: number }>);

      // Statistiques par groupe
      const statsByGroup = achievements.reduce((acc, achievement) => {
        const groupName = achievement.group.nom;
        if (!acc[groupName]) {
          acc[groupName] = { level1: 0, level2: 0, total: 0 };
        }
        if (achievement.congrats.level === 1) {
          acc[groupName].level1++;
        } else if (achievement.congrats.level === 2) {
          acc[groupName].level2++;
        }
        acc[groupName].total++;
        return acc;
      }, {} as Record<string, { level1: number; level2: number; total: number }>);

      res.json({
        totalAchievements: achievements.length,
        statsByTag,
        statsByGroup
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  }
}