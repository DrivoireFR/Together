# API REST - Together App

Une API REST complète construite avec TypeScript, Express.js, TypeORM et authentification JWT pour l'application Together.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd api
npm install
```

### 2. Configuration des variables d'environnement

**⚠️ CRITIQUE : Créez le fichier `.env` dans le dossier `api/`**

```bash
# Copiez le template et modifiez les valeurs
cp .env.example .env
```

**Contenu du fichier `.env` :**

```env
# === CONFIGURATION JWT (OBLIGATOIRE) ===
# Secret pour signer les tokens JWT - CHANGEZ EN PRODUCTION !
JWT_SECRET=votre-super-secret-jwt-très-sécurisé-changez-moi-en-production
# Durée de vie des tokens normaux
JWT_EXPIRES_IN=24h
# Durée de vie des tokens "Remember Me" 
JWT_REMEMBER_EXPIRES_IN=7d

# === CONFIGURATION BASE DE DONNÉES ===
# Chemin vers la base de données SQLite
DATABASE_PATH=./database.sqlite

# === CONFIGURATION SERVEUR ===
# Port d'écoute du serveur
PORT=3000

# === ENVIRONNEMENT ===
# Mode de développement (active les logs détaillés)
NODE_ENV=development
```

### 3. Génération d'un secret JWT sécurisé

Pour la production, générez un secret aléatoire sécurisé :

```bash
# Générer un secret de 64 bytes en hexadécimal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Initialisation des données de test

```bash
# Créer les données par défaut (tags, utilisateur test, groupe test)
npm run seed
```

### 5. Démarrage du serveur

```bash
# Mode développement (avec hot reload)
npm run dev

# Ou en production
npm run build
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📋 Variables d'environnement détaillées

### Variables obligatoires

| Variable | Description | Exemple | Importance |
|----------|-------------|---------|------------|
| `JWT_SECRET` | **Secret pour signer les tokens JWT** | `abc123...` | 🔴 **CRITIQUE** |

### Variables optionnelles (avec valeurs par défaut)

| Variable | Description | Valeur par défaut | Exemple |
|----------|-------------|-------------------|---------|
| `JWT_EXPIRES_IN` | Durée de vie tokens normaux | `24h` | `24h`, `2d`, `1800s` |
| `JWT_REMEMBER_EXPIRES_IN` | Durée de vie tokens "Remember Me" | `7d` | `7d`, `30d`, `1y` |
| `DATABASE_PATH` | Chemin base de données SQLite | `./database.sqlite` | `./data/app.db` |
| `PORT` | Port du serveur | `3000` | `3000`, `8080` |
| `NODE_ENV` | Environnement d'exécution | `development` | `development`, `production` |

## 🔐 Sécurité - Variables d'environnement

### En développement :
```env
JWT_SECRET=dev-secret-change-in-production-123456789
```

### En production :
```env
# Utilisez un secret généré aléatoirement
JWT_SECRET=a1b2c3d4e5f6...très-long-secret-aléatoire
NODE_ENV=production
```

## 🎯 Fonctionnalités

- ✅ **Authentification JWT** avec support "Remember Me"
- ✅ **Gestion des utilisateurs** (inscription, connexion, profil)
- ✅ **Système de groupes** collaboratifs
- ✅ **Gestion des tâches** avec fréquences et points
- ✅ **Tags et catégorisation** des tâches
- ✅ **Actions et suivi** des accomplissements
- ✅ **Félicitations et achievements** motivants
- ✅ **Base de données SQLite** avec TypeORM
- ✅ **Validation** avec class-validator
- ✅ **Sécurité** avec Helmet et CORS

## 📊 Données de test

Après avoir exécuté `npm run seed` :

### Utilisateur de test
- **Email** : `test@example.com`
- **Mot de passe** : `password123`
- **Nom** : Jean Dupont

### Groupe de test
- **Nom** : "Maison Test"
- **8 tâches** avec tags et points
- **4 catégories** : Ménage, Cuisine, Courses, Animal de compagnie

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Serveur avec hot reload
npm run build        # Compilation TypeScript
npm start           # Serveur en production

# Base de données
npm run seed        # Initialiser les données de test

# TypeORM
npm run typeorm     # Commandes TypeORM
npm run migration:generate  # Générer une migration
npm run migration:run      # Exécuter les migrations
```

## 🌐 Endpoints principaux

```bash
# Authentification
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
GET  /api/auth/verify      # Vérifier token
GET  /api/auth/remember-me # Remember me

# Utilisateurs
GET  /api/users/me         # Mon profil
PUT  /api/users/me         # Modifier profil

# Groupes
GET  /api/groups           # Mes groupes
POST /api/groups           # Créer groupe
POST /api/groups/:id/join  # Rejoindre groupe

# Tâches et tags
GET  /api/tasks/group/:id  # Tâches d'un groupe
POST /api/tasks           # Créer tâche
GET  /api/tags/group/:id  # Tags d'un groupe

# Actions et achievements
POST /api/actions         # Déclarer une action
GET  /api/achievements/user/:id/stats  # Statistiques
```

## ❌ Résolution des problèmes courants

### Erreur : "secretOrPrivateKey must have a value"
```bash
# Solution : Vérifiez votre fichier .env
echo $JWT_SECRET  # Doit afficher votre secret
```

### Erreur : "Database connection failed"
```bash
# Solution : Vérifiez les permissions du fichier
ls -la database.sqlite
chmod 664 database.sqlite
```

### Erreur : "Port already in use"
```bash
# Solution : Changez le port dans .env
PORT=3001
```

## 🏗️ Architecture

```
api/
├── src/
│   ├── entities/      # Entités TypeORM (User, Group, Task...)
│   ├── controllers/   # Logique métier des endpoints
│   ├── routes/        # Définition des routes Express
│   ├── middleware/    # Middleware d'authentification
│   ├── config/        # Configuration base de données
│   ├── seeders/       # Scripts d'initialisation des données
│   └── scripts/       # Scripts utilitaires
├── .env              # Variables d'environnement (À CRÉER)
├── database.sqlite   # Base de données (auto-créée)
└── package.json
```

## 📝 Notes importantes

1. **Le fichier `.env` est OBLIGATOIRE** - Sans lui, l'authentification ne fonctionnera pas
2. **Changez `JWT_SECRET` en production** - Utilisez un secret aléatoire et fort
3. **Exécutez le seeder** - Pour avoir des données de test prêtes à l'emploi
4. **Base SQLite** - Parfaite pour le développement, considérez PostgreSQL en production

## 🔗 Liens utiles

- [Documentation TypeORM](https://typeorm.io/)
- [Documentation Express](https://expressjs.com/)
- [Documentation JWT](https://jwt.io/)
- [class-validator](https://github.com/typestack/class-validator)