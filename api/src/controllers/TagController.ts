import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Tag } from '../entities/Tag';
import { Group } from '../entities/Group';
import { AuthRequest } from '../middleware/auth';

export class TagController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { label, color, groupId } = req.body;

      if (!label || !color || !groupId) {
        return res.status(400).json({
          message: 'Label, couleur et groupe requis'
        });
      }

      const tagRepository = AppDataSource.getRepository(Tag);
      const groupRepository = AppDataSource.getRepository(Group);

      // Vérifier si le groupe existe
      const group = await groupRepository.findOne({
        where: { id: groupId },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe
      const userId = req.user!.id;
      const isMember = group.users.some(user => user.id === userId);
      if (!isMember) {
        return res.status(403).json({
          message: 'Vous devez être membre du groupe pour créer un tag'
        });
      }

      // Vérifier si le tag existe déjà dans ce groupe
      const existingTag = await tagRepository.findOne({
        where: { label, group: { id: groupId } }
      });

      if (existingTag) {
        return res.status(400).json({
          message: 'Un tag avec ce nom existe déjà dans ce groupe'
        });
      }

      // Créer le tag
      const tag = new Tag();
      tag.label = label;
      tag.color = color;
      tag.group = group;

      // Valider les données
      const errors = await validate(tag);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await tagRepository.save(tag);

      res.status(201).json({
        message: 'Tag créé avec succès',
        tag
      });
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const tagRepository = AppDataSource.getRepository(Tag);
      const tags = await tagRepository.find({
        relations: ['group', 'tasks']
      });

      res.json({
        message: 'Tags récupérés avec succès',
        tags
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getByGroupId = async (req: AuthRequest, res: Response) => {
    try {
      const { groupId } = req.params;
      const tagRepository = AppDataSource.getRepository(Tag);
      const groupRepository = AppDataSource.getRepository(Group);

      // Vérifier si le groupe existe
      const group = await groupRepository.findOne({
        where: { id: parseInt(groupId) },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe
      const userId = req.user!.id;
      const isMember = group.users.some(user => user.id === userId);
      if (!isMember) {
        return res.status(403).json({
          message: 'Vous devez être membre du groupe pour voir ses tags'
        });
      }

      const tags = await tagRepository.find({
        where: { group: { id: parseInt(groupId) } },
        relations: ['group', 'tasks']
      });

      res.json({
        message: 'Tags du groupe récupérés avec succès',
        tags
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tags du groupe:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  getById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const tagRepository = AppDataSource.getRepository(Tag);

      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['group', 'tasks']
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe
      const userId = req.user!.id;
      const groupRepository = AppDataSource.getRepository(Group);
      const group = await groupRepository.findOne({
        where: { id: tag.group.id },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe associé non trouvé'
        });
      }

      const isMember = group.users.some(user => user.id === userId);
      if (!isMember) {
        return res.status(403).json({
          message: 'Vous devez être membre du groupe pour voir ce tag'
        });
      }

      res.json({
        message: 'Tag récupéré avec succès',
        tag
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du tag:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { label, color } = req.body;

      const tagRepository = AppDataSource.getRepository(Tag);
      const groupRepository = AppDataSource.getRepository(Group);

      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['group']
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe
      const userId = req.user!.id;
      const group = await groupRepository.findOne({
        where: { id: tag.group.id },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe associé non trouvé'
        });
      }

      const isMember = group.users.some(user => user.id === userId);
      if (!isMember) {
        return res.status(403).json({
          message: 'Vous devez être membre du groupe pour modifier ce tag'
        });
      }

      // Vérifier si le nouveau label existe déjà dans ce groupe
      if (label && label !== tag.label) {
        const existingTag = await tagRepository.findOne({
          where: { label, group: { id: tag.group.id } }
        });
        if (existingTag) {
          return res.status(400).json({
            message: 'Un tag avec ce nom existe déjà dans ce groupe'
          });
        }
      }

      // Mettre à jour les champs
      if (label) tag.label = label;
      if (color) tag.color = color;

      // Valider les données
      const errors = await validate(tag);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await tagRepository.save(tag);

      res.json({
        message: 'Tag mis à jour avec succès',
        tag
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tag:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const tagRepository = AppDataSource.getRepository(Tag);
      const groupRepository = AppDataSource.getRepository(Group);

      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['group', 'tasks']
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
        });
      }

      // Vérifier si l'utilisateur est membre du groupe
      const userId = req.user!.id;
      const group = await groupRepository.findOne({
        where: { id: tag.group.id },
        relations: ['users']
      });

      if (!group) {
        return res.status(404).json({
          message: 'Groupe associé non trouvé'
        });
      }

      const isMember = group.users.some(user => user.id === userId);
      if (!isMember) {
        return res.status(403).json({
          message: 'Vous devez être membre du groupe pour supprimer ce tag'
        });
      }

      // Vérifier si le tag est utilisé par des tâches
      if (tag.tasks && tag.tasks.length > 0) {
        return res.status(400).json({
          message: 'Impossible de supprimer le tag car il est utilisé par des tâches'
        });
      }

      await tagRepository.remove(tag);

      res.json({
        message: 'Tag supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}