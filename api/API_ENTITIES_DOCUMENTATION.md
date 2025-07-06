# Documentation des nouvelles entités API

## Vue d'ensemble

Cette API a été étendue avec quatre nouvelles entités pour gérer un système de tâches collaboratives et de suivi d'actions :

- **Group** : Groupes d'utilisateurs
- **Task** : Tâches assignées aux groupes
- **Action** : Actions réalisées par les utilisateurs sur les tâches
- **Tag** : Étiquettes pour catégoriser les tâches

## Entités et leurs relations

### Group
Représente un groupe d'utilisateurs qui peuvent collaborer sur des tâches.

**Propriétés :**
- `id` : Identifiant unique (auto-généré)
- `nom` : Nom du groupe (unique)
- `users` : Liste des utilisateurs membres du groupe (Many-to-Many)
- `tasks` : Liste des tâches du groupe (One-to-Many)
- `actions` : Liste des actions réalisées dans le groupe (One-to-Many)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

### Task
Représente une tâche à réaliser dans un groupe.

**Propriétés :**
- `id` : Identifiant unique (auto-généré)
- `label` : Nom de la tâche
- `iconUrl` : URL de l'icône de la tâche (optionnel)
- `frequenceEstimee` : Fréquence estimée (nombre entier)
- `uniteFrequence` : Unité de fréquence (enum : "jour", "semaine", "mois")
- `group` : Groupe auquel appartient la tâche (Many-to-One)
- `tag` : Tag associé à la tâche (Many-to-One, optionnel)
- `actions` : Liste des actions réalisées pour cette tâche (One-to-Many)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

### Action
Représente une action réalisée par un utilisateur sur une tâche.

**Propriétés :**
- `id` : Identifiant unique (auto-généré)
- `date` : Date de réalisation de l'action
- `task` : Tâche associée (Many-to-One)
- `user` : Utilisateur qui a réalisé l'action (Many-to-One)
- `group` : Groupe dans lequel l'action a été réalisée (Many-to-One)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

### Tag
Représente une étiquette pour catégoriser les tâches.

**Propriétés :**
- `id` : Identifiant unique (auto-généré)
- `label` : Nom du tag (unique)
- `color` : Couleur du tag (format hexadécimal)
- `tasks` : Liste des tâches associées (One-to-Many)
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

## Routes API

### Tags (`/api/tags`)
- `POST /` : Créer un tag
- `GET /` : Récupérer tous les tags
- `GET /:id` : Récupérer un tag par ID
- `PUT /:id` : Mettre à jour un tag
- `DELETE /:id` : Supprimer un tag

### Groupes (`/api/groups`)
- `POST /` : Créer un groupe
- `GET /` : Récupérer tous les groupes
- `GET /search/name?nom=...` : Rechercher des groupes par nom
- `GET /search/email?email=...` : Rechercher des groupes par email d'un membre
- `GET /:id` : Récupérer un groupe par ID
- `PUT /:id` : Mettre à jour un groupe
- `DELETE /:id` : Supprimer un groupe
- `POST /:id/join` : Rejoindre un groupe
- `POST /:id/leave` : Quitter un groupe

### Tâches (`/api/tasks`)
- `POST /` : Créer une tâche
- `GET /` : Récupérer toutes les tâches
- `GET /group/:groupId` : Récupérer les tâches d'un groupe
- `GET /:id` : Récupérer une tâche par ID
- `PUT /:id` : Mettre à jour une tâche
- `DELETE /:id` : Supprimer une tâche

### Actions (`/api/actions`)
- `POST /` : Créer une action
- `GET /` : Récupérer toutes les actions
- `GET /me` : Récupérer mes actions
- `GET /statistics` : Récupérer les statistiques (avec filtres)
- `GET /user/:userId` : Récupérer les actions d'un utilisateur
- `GET /group/:groupId` : Récupérer les actions d'un groupe
- `GET /task/:taskId` : Récupérer les actions d'une tâche
- `GET /:id` : Récupérer une action par ID
- `PUT /:id` : Mettre à jour une action
- `DELETE /:id` : Supprimer une action

## Exemples d'utilisation

### 1. Créer un tag
```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "label": "Urgent",
    "color": "#FF0000"
  }'
```

### 2. Créer un groupe
```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "Équipe Dev"
  }'
```

### 3. Rechercher un groupe par nom
```bash
curl -X GET "http://localhost:3000/api/groups/search/name?nom=Dev" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Rejoindre un groupe
```bash
curl -X POST http://localhost:3000/api/groups/1/join \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Créer une tâche
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "label": "Nettoyer le code",
    "frequenceEstimee": 2,
    "uniteFrequence": "semaine",
    "groupId": 1,
    "tagId": 1
  }'
```

### 6. Déclarer une action
```bash
curl -X POST http://localhost:3000/api/actions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "taskId": 1,
    "date": "2024-01-15T10:30:00Z"
  }'
```

### 7. Récupérer les statistiques
```bash
curl -X GET "http://localhost:3000/api/actions/statistics?groupId=1&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Fonctionnalités spéciales

### Recherche de groupes
- **Par nom** : Recherche partielle dans le nom des groupes
- **Par email** : Trouve tous les groupes dont un membre a cet email

### Gestion des membres
- Les utilisateurs peuvent rejoindre ou quitter des groupes
- Seuls les membres d'un groupe peuvent créer des actions sur les tâches de ce groupe

### Statistiques
- Comptage total des actions
- Répartition des actions par utilisateur
- Répartition des actions par tâche
- Filtrage par groupe, tâche, utilisateur et période

### Sécurité
- Toutes les routes nécessitent une authentification (token JWT)
- Les utilisateurs ne peuvent modifier/supprimer que leurs propres actions
- Vérification de l'appartenance aux groupes pour les actions

### Contraintes d'intégrité
- Impossible de supprimer un tag utilisé par des tâches
- Impossible de supprimer un groupe contenant des tâches ou actions
- Impossible de supprimer une tâche contenant des actions

## Base de données

L'API utilise SQLite avec TypeORM et la synchronisation automatique est activée en développement. En production, il est recommandé d'utiliser les migrations TypeORM.

Les nouvelles tables créées :
- `tag`
- `group`
- `task`
- `action`
- `group_users_user` (table de liaison pour la relation Many-to-Many)

## Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Compiler le projet
npm run build

# Démarrer en production
npm start
```

L'API sera accessible sur `http://localhost:3000` avec les nouvelles routes disponibles immédiatement.