import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  // GET /api/users - Récupérer tous les utilisateurs
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'nom', 'prenom', 'pseudo', 'email', 'icone', 'createdAt', 'updatedAt']
      });

      res.json({
        message: 'Utilisateurs récupérés avec succès',
        users
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  // GET /api/users/:id - Récupérer un utilisateur par ID
  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        select: ['id', 'nom', 'prenom', 'pseudo', 'email', 'icone', 'createdAt', 'updatedAt']
      });

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        message: 'Utilisateur récupéré avec succès',
        user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  // GET /api/users/me - Récupérer le profil de l'utilisateur connecté
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Utilisateur non authentifié'
        });
      }

      const { password: _, ...userWithoutPassword } = req.user;

      res.json({
        message: 'Profil récupéré avec succès',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  // PUT /api/users/:id - Mettre à jour un utilisateur
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nom, prenom, pseudo, email, icone } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si l'email ou le pseudo existe déjà pour un autre utilisateur
      if (email && email !== user.email) {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            message: 'Un utilisateur avec cet email existe déjà'
          });
        }
      }

      if (pseudo && pseudo !== user.pseudo) {
        const existingUser = await userRepository.findOne({ where: { pseudo } });
        if (existingUser) {
          return res.status(400).json({
            message: 'Un utilisateur avec ce pseudo existe déjà'
          });
        }
      }

      // Mettre à jour les champs
      if (nom) user.nom = nom;
      if (prenom) user.prenom = prenom;
      if (pseudo) user.pseudo = pseudo;
      if (email) user.email = email;
      if (icone !== undefined) user.icone = icone;

      // Valider les données
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  // PUT /api/users/me - Mettre à jour le profil de l'utilisateur connecté
  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Utilisateur non authentifié'
        });
      }

      const { nom, prenom, pseudo, email, icone } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      // Vérifier si l'email ou le pseudo existe déjà pour un autre utilisateur
      if (email && email !== req.user.email) {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            message: 'Un utilisateur avec cet email existe déjà'
          });
        }
      }

      if (pseudo && pseudo !== req.user.pseudo) {
        const existingUser = await userRepository.findOne({ where: { pseudo } });
        if (existingUser) {
          return res.status(400).json({
            message: 'Un utilisateur avec ce pseudo existe déjà'
          });
        }
      }

      // Mettre à jour les champs
      if (nom) req.user.nom = nom;
      if (prenom) req.user.prenom = prenom;
      if (pseudo) req.user.pseudo = pseudo;
      if (email) req.user.email = email;
      if (icone !== undefined) req.user.icone = icone;

      // Valider les données
      const errors = await validate(req.user);
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erreurs de validation',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      }

      await userRepository.save(req.user);

      const { password: _, ...userWithoutPassword } = req.user;

      res.json({
        message: 'Profil mis à jour avec succès',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  // DELETE /api/users/:id - Supprimer un utilisateur
  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: parseInt(id) } });

      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      await userRepository.remove(user);

      res.json({
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}