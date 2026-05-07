# Together API - NestJS Backend

API Backend du projet Together, construite avec [NestJS](https://nestjs.com/).

## 📋 Description

API REST pour la gestion collaborative de tâches, permettant :
- **Authentification** avec JWT et Remember Me
- **Gestion de groupes** collaboratifs
- **Gestion de tâches** avec états utilisateur
- **Actions** sur les tâches
- **Tags** et **Achievements**
- **Statistiques** d'utilisation

## 🚀 Installation

```bash
npm install
```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet :

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://together:together@localhost:5433/together

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REMEMBER_EXPIRES_IN=30d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:80
```

## 🏃 Démarrage

```bash
# Mode développement (avec hot-reload)
npm run start:dev

# Mode production
npm run start:prod

# Mode debug
npm run start:debug
```

L'API sera accessible sur `http://localhost:3000/api`

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de code
npm run test:cov
```

## 🏗️ Architecture

```
nest-api/
├── src/
│   ├── actions/           # Gestion des actions sur tâches
│   ├── achievements/      # Système d'achievements
│   ├── auth/             # Authentification JWT
│   ├── common/           # Utilitaires partagés
│   ├── congrats/         # Messages de félicitations
│   ├── groups/           # Gestion des groupes
│   ├── stats/            # Statistiques
│   ├── tags/             # Gestion des tags
│   ├── tasks/            # Gestion des tâches
│   ├── users/            # Gestion des utilisateurs
│   ├── user-task-states/ # États utilisateur-tâche
│   ├── app.module.ts     # Module principal
│   └── main.ts           # Point d'entrée
├── data/                 # Base de données SQLite
├── test/                 # Tests e2e
└── dist/                 # Fichiers compilés
```

## 📚 Documentation API

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Groupes
- `GET /api/groups` - Liste des groupes
- `POST /api/groups` - Créer un groupe
- `GET /api/groups/:id` - Détails d'un groupe
- `PUT /api/groups/:id` - Modifier un groupe
- `DELETE /api/groups/:id` - Supprimer un groupe

#### Tâches
- `GET /api/tasks/group/:groupId` - Tâches d'un groupe
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

#### Actions
- `POST /api/actions` - Créer une action
- `GET /api/actions/task/:taskId` - Actions d'une tâche

#### User Task States
- `PUT /api/user-task-states/:taskId` - Mettre à jour l'état d'une tâche
- `GET /api/user-task-states/group/:groupId` - États des tâches d'un groupe

#### Statistiques
- `GET /api/stats/user` - Statistiques utilisateur
- `GET /api/stats/group/:groupId` - Statistiques d'un groupe

## 🐳 Docker

```bash
# Build
docker build -t together-api .

# Run en développement
docker-compose -f ../docker-compose.dev.yml up

# Run en production
docker-compose -f ../docker-compose.prod.yml up
```

## 🔐 Sécurité

- Authentification JWT avec refresh tokens
- Validation des entrées avec class-validator
- Protection CORS configurable
- Hash des mots de passe avec bcrypt
- Guards d'authentification sur les routes protégées

## 📝 Technologies utilisées

- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour SQLite
- **SQLite** - Base de données
- **JWT** - Authentification
- **bcrypt** - Hash des mots de passe
- **class-validator** - Validation des données

## 🔗 Liens utiles

- [Documentation NestJS](https://docs.nestjs.com)
- [Documentation TypeORM](https://typeorm.io)
- [Documentation Projet](../README.md)

## 📄 Licence

MIT
