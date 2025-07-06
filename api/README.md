# API REST TypeScript Express avec TypeORM

Une API REST complète construite avec TypeScript, Express.js, TypeORM et authentification JWT.

## Fonctionnalités

- 🔐 Authentification JWT avec support "Remember Me"
- 👥 Gestion des utilisateurs (CRUD)
- 🗄️ Base de données SQLite avec TypeORM
- ✅ Validation des données avec class-validator
- 🔒 Sécurité avec Helmet et CORS
- 📝 Architecture propre (Entities, Controllers, Routes)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Modifier les valeurs dans .env
```

3. Démarrer en mode développement :
```bash
npm run dev
```

4. Ou compiler et démarrer en production :
```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── entities/        # Entités TypeORM
├── controllers/     # Contrôleurs de l'API
├── routes/          # Routes Express
├── middleware/      # Middlewares personnalisés
├── config/          # Configuration (base de données, etc.)
└── utils/           # Utilitaires
```

## Endpoints de l'API

### Authentification

#### POST /api/auth/register
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "pseudo": "jeandupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123",
  "icone": "https://example.com/avatar.jpg"
}
```

#### POST /api/auth/login
Connexion d'un utilisateur.

**Body :**
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123",
  "rememberMe": true
}
```

#### GET /api/auth/verify
Vérification du token JWT.

**Headers :**
```
Authorization: Bearer <token>
```

#### GET /api/auth/remember-me
Vérification du token "Remember Me".

**Headers :**
```
Authorization: Bearer <remember-me-token>
```

### Utilisateurs

#### GET /api/users
Récupération de tous les utilisateurs.

#### GET /api/users/me
Récupération du profil de l'utilisateur connecté.

**Headers :**
```
Authorization: Bearer <token>
```

#### GET /api/users/:id
Récupération d'un utilisateur par ID.

#### PUT /api/users/me
Mise à jour du profil de l'utilisateur connecté.

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "nom": "Nouveau nom",
  "prenom": "Nouveau prénom",
  "pseudo": "nouveaupseudo",
  "email": "nouvel.email@example.com",
  "icone": "https://example.com/new-avatar.jpg"
}
```

#### PUT /api/users/:id
Mise à jour d'un utilisateur.

**Headers :**
```
Authorization: Bearer <token>
```

#### DELETE /api/users/:id
Suppression d'un utilisateur.

**Headers :**
```
Authorization: Bearer <token>
```

## Entité User

L'entité User contient les champs suivants :

- `id` : Identifiant unique (auto-généré)
- `nom` : Nom de famille
- `prenom` : Prénom
- `pseudo` : Pseudo unique
- `email` : Adresse email unique
- `password` : Mot de passe hashé
- `icone` : URL de l'icône/avatar (optionnel)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière mise à jour

## Authentification JWT

### Token normal
- Durée de vie : 24h (configurable)
- Contient : userId, email

### Token Remember Me
- Durée de vie : 30 jours (configurable)
- Contient : userId, email, rememberMe: true
- Permet de rester connecté plus longtemps

## Variables d'environnement

```env
PORT=3000
JWT_SECRET=votre-secret-jwt-ultra-securise
JWT_EXPIRES_IN=24h
JWT_REMEMBER_EXPIRES_IN=30d
DATABASE_PATH=./database.sqlite
```

## Scripts disponibles

- `npm run dev` : Démarrer en mode développement avec nodemon
- `npm run build` : Compiler le TypeScript
- `npm start` : Démarrer en production
- `npm run typeorm` : Commandes TypeORM

## Sécurité

- Mots de passe hashés avec bcrypt
- Validation des données avec class-validator
- Protection CORS
- Headers de sécurité avec Helmet
- Gestion des erreurs centralisée

## Test de l'API

### Route de santé
```bash
GET http://localhost:3000/api/health
```

### Exemple d'inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "pseudo": "jeandupont",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123"
  }'
```

### Exemple de connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "rememberMe": true
  }'
```