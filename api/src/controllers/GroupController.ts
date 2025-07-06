import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';

export class GroupController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { nom } = req.body;

      if (!nom) {
        return res.status(400).json({
          message: 'Nom du groupe requis'
        });
      }

      const groupRepository = AppDataSource.getRepository(Group);

      // Vérifier si le groupe existe déjà
      const existingGroup = await groupRepository.findOne({ where: { nom } });
      if (existingGroup) {
        return res.status(400).json({
          message: 'Un groupe avec ce nom existe déjà'
        });
      }

      // Créer le groupe
      const group = new Group();
      group.nom = nom;

      // Valider les données
      const errors = await validate(group);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await groupRepository.save(group);

      res.status(201).json({
        message: 'Groupe créé avec succès',
        group
      });
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const groupRepository = AppDataSource.getRepository(Group);
      const groups = await groupRepository.find({
        relations: ['users', 'tasks', 'actions', 'tags']
      });

      res.json({
        message: 'Groupes récupérés avec succès',
        groups
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const groupRepository = AppDataSource.getRepository(Group);
      
      const group = await groupRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['users', 'tasks', 'actions', 'tags']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      res.json({
        message: 'Groupe récupéré avec succès',
        group
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async searchByName(req: AuthRequest, res: Response) {
    try {
      const { nom } = req.query;

      if (!nom) {
        return res.status(400).json({
          message: 'Nom de groupe requis'
        });
      }

      const groupRepository = AppDataSource.getRepository(Group);
      
      const groups = await groupRepository
        .createQueryBuilder('group')
        .where('group.nom LIKE :nom', { nom: `%${nom}%` })
        .leftJoinAndSelect('group.users', 'users')
        .leftJoinAndSelect('group.tasks', 'tasks')
        .leftJoinAndSelect('group.tags', 'tags')
        .getMany();

      res.json({
        message: 'Groupes trouvés',
        groups
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de groupes:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async searchByUserEmail(req: AuthRequest, res: Response) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          message: 'Email requis'
        });
      }

      const groupRepository = AppDataSource.getRepository(Group);
      
      const groups = await groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.users', 'users')
        .where('users.email = :email', { email })
        .leftJoinAndSelect('group.tasks', 'tasks')
        .leftJoinAndSelect('group.tags', 'tags')
        .getMany();

      res.json({
        message: 'Groupes trouvés',
        groups
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de groupes par email:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async joinGroup(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const groupRepository = AppDataSource.getRepository(Group);
      const userRepository = AppDataSource.getRepository(User);
      
      const group = await groupRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      const user = await userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'utilisateur est déjà dans le groupe
      const isAlreadyMember = group.users.some(u => u.id === userId);
      if (isAlreadyMember) {
        return res.status(400).json({
          message: 'Utilisateur déjà membre du groupe'
        });
      }

      // Ajouter l'utilisateur au groupe
      group.users.push(user);
      await groupRepository.save(group);

      res.json({
        message: 'Utilisateur ajouté au groupe avec succès',
        group
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async leaveGroup(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const groupRepository = AppDataSource.getRepository(Group);
      
      const group = await groupRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si l'utilisateur est dans le groupe
      const userIndex = group.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return res.status(400).json({
          message: 'Utilisateur non membre du groupe'
        });
      }

      // Retirer l'utilisateur du groupe
      group.users.splice(userIndex, 1);
      await groupRepository.save(group);

      res.json({
        message: 'Utilisateur retiré du groupe avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la sortie du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { nom } = req.body;

      const groupRepository = AppDataSource.getRepository(Group);
      
      const group = await groupRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si le nouveau nom existe déjà
      if (nom && nom !== group.nom) {
        const existingGroup = await groupRepository.findOne({ where: { nom } });
        if (existingGroup) {
          return res.status(400).json({
            message: 'Un groupe avec ce nom existe déjà'
          });
        }
      }

      // Mettre à jour le nom
      if (nom) group.nom = nom;

      // Valider les données
      const errors = await validate(group);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await groupRepository.save(group);

      res.json({
        message: 'Groupe mis à jour avec succès',
        group
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const groupRepository = AppDataSource.getRepository(Group);
      
      const group = await groupRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['users', 'tasks', 'actions', 'tags']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si le groupe a des tâches, actions ou tags
      if (group.tasks && group.tasks.length > 0) {
        return res.status(400).json({
          message: 'Impossible de supprimer le groupe car il contient des tâches'
        });
      }

      if (group.actions && group.actions.length > 0) {
        return res.status(400).json({
          message: 'Impossible de supprimer le groupe car il contient des actions'
        });
      }

      if (group.tags && group.tags.length > 0) {
        return res.status(400).json({
          message: 'Impossible de supprimer le groupe car il contient des tags'
        });
      }

      await groupRepository.remove(group);

      res.json({
        message: 'Groupe supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}