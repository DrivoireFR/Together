import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Tag } from '../entities/Tag';
import { AuthRequest } from '../middleware/auth';

export class TagController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { label, color } = req.body;

      if (!label || !color) {
        return res.status(400).json({
          message: 'Label et couleur requis'
        });
      }

      const tagRepository = AppDataSource.getRepository(Tag);

      // Vérifier si le tag existe déjà
      const existingTag = await tagRepository.findOne({ where: { label } });
      if (existingTag) {
        return res.status(400).json({
          message: 'Un tag avec ce nom existe déjà'
        });
      }

      // Créer le tag
      const tag = new Tag();
      tag.label = label;
      tag.color = color;

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

  async getAll(req: AuthRequest, res: Response) {
    try {
      const tagRepository = AppDataSource.getRepository(Tag);
      const tags = await tagRepository.find({
        relations: ['tasks']
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

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const tagRepository = AppDataSource.getRepository(Tag);
      
      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['tasks']
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
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

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { label, color } = req.body;

      const tagRepository = AppDataSource.getRepository(Tag);
      
      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
        });
      }

      // Vérifier si le nouveau label existe déjà
      if (label && label !== tag.label) {
        const existingTag = await tagRepository.findOne({ where: { label } });
        if (existingTag) {
          return res.status(400).json({
            message: 'Un tag avec ce nom existe déjà'
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

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const tagRepository = AppDataSource.getRepository(Tag);
      
      const tag = await tagRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['tasks']
      });

      if (!tag) {
        return res.status(404).json({
          message: 'Tag non trouvé'
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