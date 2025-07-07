# Documentation - Système de Félicitations et Achievements

## Vue d'ensemble

Cette mise à jour introduit un système de félicitations (Congrats) et d'accomplissements (Achievements) pour motiver les utilisateurs dans l'accomplissement de leurs tâches.

## Nouvelles Entités

### 1. Tag (Mise à jour)
L'entité Tag existante a été étendue avec une nouvelle propriété :
- `isDefault: boolean` - Indique si le tag fait partie des tags par défaut du système

### 2. Congrats (Nouvelle entité)
Représente un message de félicitation lié à une catégorie (Tag) et un niveau de progression.

**Propriétés :**
- `id: number` - Identifiant unique
- `level: number` - Niveau du congrats (1 ou 2)
- `message: string` - Texte de félicitation
- `tag: Tag` - Relation vers le tag concerné
- `achievements: Achievement[]` - Liste des achievements utilisant ce congrats
- `createdAt: Date` - Date de création
- `updatedAt: Date` - Date de dernière modification

### 3. Achievement (Nouvelle entité)
Représente l'attribution d'un Congrats à un utilisateur dans un groupe spécifique à une date donnée.

**Propriétés :**
- `id: number` - Identifiant unique
- `user: User` - Relation vers l'utilisateur
- `group: Group` - Relation vers le groupe concerné
- `congrats: Congrats` - Relation vers le congrats attribué
- `achievedAt: Date` - Date d'obtention de l'achievement
- `createdAt: Date` - Date de création

## Tags par Défaut

Le système inclut 4 catégories de tags par défaut :

1. **Ménage** (#3B82F6 - Bleu)
2. **Animal de compagnie** (#10B981 - Vert)
3. **Cuisine** (#F59E0B - Orange)
4. **Courses** (#EF4444 - Rouge)

Chaque catégorie possède 2 niveaux de congrats :
- **Niveau 1** : Message d'encouragement
- **Niveau 2** : Message de félicitation

## Messages de Félicitations

### Ménage
- **Niveau 1** : "Bon début ! Continuer comme ça, votre foyer devient plus agréable ! 🧹"
- **Niveau 2** : "Félicitations ! Votre maison est impeccable ! Vous maîtrisez l'art du ménage ! ✨"

### Animal de compagnie
- **Niveau 1** : "Super ! Votre animal de compagnie vous remercie pour ces bons soins ! 🐾"
- **Niveau 2** : "Bravo ! Vous êtes un parent parfait pour votre animal ! Il est chanceux de vous avoir ! 🏆"

### Cuisine
- **Niveau 1** : "Excellent ! Vous progressez bien en cuisine, continuez à régaler ! 👨‍🍳"
- **Niveau 2** : "Incroyable ! Vous êtes devenu un véritable chef ! Vos plats sont délicieux ! 🍽️"

### Courses
- **Niveau 1** : "Bien joué ! Vous gérez bien vos courses, c'est un bon start ! 🛒"
- **Niveau 2** : "Parfait ! Vous êtes un pro de l'organisation pour les courses ! Rien ne vous échappe ! 🎯"

## API Endpoints

### Congrats

#### GET /api/congrats
Récupère tous les congrats avec leurs tags associés.

#### GET /api/congrats/:id
Récupère un congrats spécifique par son ID.

#### GET /api/congrats/tag/:tagId
Récupère tous les congrats associés à un tag spécifique.

#### POST /api/congrats
Crée un nouveau congrats.
```json
{
  "level": 1,
  "message": "Message de félicitation",
  "tagId": 1
}
```

#### PUT /api/congrats/:id
Met à jour un congrats existant.

#### DELETE /api/congrats/:id
Supprime un congrats.

### Achievements

#### GET /api/achievements
Récupère tous les achievements.

#### GET /api/achievements/:id
Récupère un achievement spécifique par son ID.

#### GET /api/achievements/user/:userId
Récupère tous les achievements d'un utilisateur (triés par date décroissante).

#### GET /api/achievements/group/:groupId
Récupère tous les achievements d'un groupe (triés par date décroissante).

#### GET /api/achievements/user/:userId/stats
Récupère les statistiques d'achievements d'un utilisateur.
Paramètre optionnel : `?groupId=X` pour filtrer par groupe.
```json
{
  "totalAchievements": 5,
  "statsByTag": {
    "Ménage": { "level1": 2, "level2": 1, "total": 3 },
    "Cuisine": { "level1": 1, "level2": 1, "total": 2 }
  },
  "statsByGroup": {
    "Famille": { "level1": 3, "level2": 2, "total": 5 }
  }
}
```

#### POST /api/achievements
Attribue un achievement à un utilisateur dans un groupe spécifique.
```json
{
  "userId": 1,
  "groupId": 1,
  "congratsId": 1,
  "achievedAt": "2024-01-15T10:30:00Z" // optionnel, date actuelle par défaut
}
```

#### DELETE /api/achievements/:id
Supprime un achievement.

## Seeder

### TagsAndCongratsSeeder
Le seeder `TagsAndCongratsSeeder` permet d'initialiser la base de données avec les tags par défaut et leurs congrats associés.

**Utilisation :**
```bash
# Exécuter le seeder
npm run seed
```

Le seeder :
1. Vérifie l'existence des tags par défaut
2. Crée les tags manquants avec `isDefault: true`
3. Crée les congrats de niveau 1 et 2 pour chaque tag
4. Évite les doublons en vérifiant l'existence avant création

## Script d'exécution

Le script `runSeeder.ts` permet d'exécuter facilement le seeder :
```bash
ts-node src/scripts/runSeeder.ts
```

## Utilisation en pratique

### Attribution d'un Achievement
1. L'utilisateur accomplit une tâche d'une catégorie spécifique dans un groupe
2. Le système détermine le niveau de progression (1 ou 2) basé sur la participation dans ce groupe
3. Un Achievement est créé avec le Congrats correspondant pour ce groupe spécifique
4. L'utilisateur reçoit le message de félicitation dans le contexte du groupe

### Consultation des Achievements
- L'utilisateur peut consulter ses achievements via `/api/achievements/user/:userId`
- Les statistiques détaillées sont disponibles via `/api/achievements/user/:userId/stats`
- Possibilité de filtrer par tag ou niveau

## Extensibilité

Le système est conçu pour être facilement extensible :
- Ajout de nouveaux tags par défaut
- Création de nouveaux niveaux de congrats
- Personnalisation des messages par utilisateur ou groupe
- Intégration avec d'autres systèmes de motivation