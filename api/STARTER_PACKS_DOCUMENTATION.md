# StarterPacks - Documentation Backend

## Vue d'ensemble

La fonctionnalité StarterPacks permet aux utilisateurs de créer des groupes avec un ensemble prédéfini de tags et de tâches, évitant ainsi la saisie manuelle fastidieuse lors de la création d'un nouveau groupe.

## Fonctionnalités implémentées

### 1. Création de groupe avec StarterPack automatique

Lors de la création d'un groupe, l'API retourne maintenant un objet `starterPack` contenant:
- Une liste de tags prédéfinis
- Une liste de tâches prédéfinies avec leurs catégories (tags) associées

**Endpoint:** `POST /api/groups`

**Réponse modifiée:**
```json
{
  "message": "Groupe créé avec succès",
  "group": {
    "id": 1,
    "nom": "Mon Groupe",
    "code": "ABC12345",
    ...
  },
  "starterPack": {
    "tags": [
      {
        "id": 1,
        "label": "Ménage",
        "color": "#FF6B6B",
        "isDefault": true,
        ...
      }
    ],
    "tasks": [
      {
        "id": 1,
        "label": "Passer l'aspirateur",
        "frequenceEstimee": 2,
        "uniteFrequence": "semaine",
        "points": 3,
        "tag": {
          "id": 1,
          "label": "Ménage",
          ...
        },
        ...
      }
    ]
  }
}
```

### 2. Ajout en bulk de tags à un groupe

**Endpoint:** `POST /api/groups/:id/tags`

**Payload:**
```json
{
  "tags": [
    {
      "label": "Nouveau Tag",
      "color": "#FF0000"
    },
    {
      "label": "Autre Tag",
      "color": "#00FF00"
    }
  ]
}
```

**Réponse:**
```json
{
  "message": "Tags ajoutés avec succès",
  "tags": [
    {
      "id": 10,
      "label": "Nouveau Tag",
      "color": "#FF0000",
      "isDefault": true,
      ...
    }
  ]
}
```

### 3. Ajout en bulk de tâches à un groupe

**Endpoint:** `POST /api/groups/:id/tasks`

**Payload:**
```json
{
  "tasks": [
    {
      "label": "Nouvelle tâche",
      "frequenceEstimee": 1,
      "uniteFrequence": "semaine",
      "points": 2,
      "tagLabel": "Ménage"
    }
  ]
}
```

**Réponse:**
```json
{
  "message": "Tâches ajoutées avec succès",
  "tasks": [
    {
      "id": 20,
      "label": "Nouvelle tâche",
      "frequenceEstimee": 1,
      "uniteFrequence": "semaine",
      "points": 2,
      "tag": {
        "id": 1,
        "label": "Ménage",
        ...
      },
      ...
    }
  ]
}
```

## Architecture technique

### Fichiers créés/modifiés

1. **`/src/data/starter-packs.json`** - Données par défaut des starter packs
2. **`/src/services/StarterPackService.ts`** - Service pour gérer les opérations de starter pack
3. **`/src/controllers/GroupController.ts`** - Modifié pour intégrer les starter packs
4. **`/src/routes/groups.ts`** - Nouvelles routes pour les opérations en bulk

### StarterPackService

Le service `StarterPackService` gère:
- Le chargement des données depuis le fichier JSON
- La création de tags en bulk pour un groupe
- La création de tâches en bulk avec association aux tags
- La gestion des doublons (évite de créer des tags/tâches qui existent déjà)

### Données par défaut

Le fichier `starter-packs.json` contient:
- **6 catégories de tags:** Ménage, Cuisine, Courses, Entretien, Personnel, Administratif
- **12 tâches prédéfinies** réparties dans ces catégories

### Validation et sécurité

- Vérification que l'utilisateur est membre du groupe avant d'ajouter des tags/tâches
- Validation des données d'entrée (structure des tags et tâches)
- Gestion des erreurs avec messages appropriés
- Prévention des doublons

## Utilisation

### Créer un groupe avec starter pack
```javascript
const response = await fetch('/api/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    nom: 'Mon nouveau groupe'
  })
});

const data = await response.json();
console.log('Tags disponibles:', data.starterPack.tags);
console.log('Tâches disponibles:', data.starterPack.tasks);
```

### Ajouter des tags personnalisés
```javascript
await fetch(`/api/groups/${groupId}/tags`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    tags: [
      { label: 'Mon Tag', color: '#FF5733' }
    ]
  })
});
```

### Ajouter des tâches personnalisées
```javascript
await fetch(`/api/groups/${groupId}/tasks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    tasks: [
      {
        label: 'Ma tâche personnalisée',
        frequenceEstimee: 2,
        uniteFrequence: 'semaine',
        points: 3,
        tagLabel: 'Mon Tag'
      }
    ]
  })
});
```

## Tests

Un script de test `test-starter-packs.js` est fourni pour valider le bon fonctionnement de toutes les fonctionnalités.

Pour l'utiliser:
1. Démarrer l'API
2. Obtenir un token d'authentification valide
3. Remplacer `YOUR_AUTH_TOKEN_HERE` dans le script
4. Lancer: `node test-starter-packs.js`

## Critères d'acceptance ✅

- ✅ **La méthode de création d'un groupe retourne en plus du message de succès, un objet "starterPack" qui contient une liste de Tag "tags" et une liste de Task "tasks"**
- ✅ **Nouvelle méthode pour ajouter une liste de "Tag" au groupe** (`POST /api/groups/:id/tags`)
- ✅ **Nouvelle méthode pour ajouter une liste de "Task" au groupe** (`POST /api/groups/:id/tasks`) avec catégorisation automatique dans les tags
- ✅ **Enregistrement de la proposition standard de Tag et Tasks dans un fichier json** (`/src/data/starter-packs.json`)

## Notes techniques

- Les tags créés via le starter pack ont la propriété `isDefault: true`
- La cohérence entre tags et tasks est assurée par la référence `tagLabel` dans les données JSON
- Le service gère automatiquement la création des associations entre tâches et tags
- Les doublons sont évités en vérifiant l'existence avant création
- Toutes les opérations respectent les permissions d'accès aux groupes