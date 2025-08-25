import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { generateToken, AuthRequest } from '../middleware/auth';

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const { nom, prenom, pseudo, email, password, icone } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: [
          { email },
          { pseudo }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Un utilisateur avec cet email ou ce pseudo existe déjà'
        });
      }

      // Créer un nouvel utilisateur
      const user = new User();
      user.nom = nom;
      user.prenom = prenom;
      user.pseudo = pseudo;
      user.email = email;
      user.password = password;
      user.icone = icone;

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

      // Sauvegarder l'utilisateur
      await userRepository.save(user);

      // Générer un token
      const token = generateToken(user, false);

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password, rememberMe = false } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email et mot de passe requis'
        });
      }

      // Trouver l'utilisateur
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          message: 'Identifiants invalides'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Identifiants invalides'
        });
      }

      // Générer un token
      const token = generateToken(user, rememberMe);

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token,
        rememberMe
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  verifyToken = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Token invalide'
        });
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = req.user;

      res.json({
        message: 'Token valide',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }

  rememberMeVerify = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Token remember me invalide'
        });
      }

      // Générer un nouveau token normal
      const token = generateToken(req.user, false);

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = req.user;

      res.json({
        message: 'Remember me vérifié avec succès',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erreur lors de la vérification remember me:', error);
      res.status(500).json({
        message: 'Erreur interne du serveur'
      });
    }
  }
}