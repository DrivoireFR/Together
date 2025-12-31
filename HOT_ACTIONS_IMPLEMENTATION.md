# Hot Actions - Implémentation Backend

## Vue d'ensemble

L'implémentation des "Hot Actions" permet de détecter automatiquement les tâches en retard par rapport à leur fréquence désirée dans le mois courant.

## Algorithme de calcul

Votre approche de **multiplication de la fréquence par l'unité pour obtenir un nombre nécessaire par mois, puis multiplier par le ratio d'avancée du mois** a été implémentée avec optimisations.

### Formule de calcul

```
Actions attendues = (Fréquence × ConversionMensuelle) × RatioAvancementMois
```

**Conversions mensuelles :**
- Quotidien : × 30
- Hebdomadaire : × 4.33 (plus précis que 4)
- Mensuel : × 1

**Ratio d'avancement :** `JourActuel / NombreDeJoursDansLeMois`

### États de retard (HurryState)

- **NOPE** : 0-1 action en retard ✅
- **MAYBE** : 2 actions en retard ⚠️
- **YES** : 3+ actions en retard 🚨

## Structure des fichiers créés

```
nest-api/src/
├── types/HurryState.ts          # Enum et interfaces TypeScript
├── helpers/hurryCalculation.ts  # Logique de calcul pure
├── services/HotActionsService.ts # Service de données optimisé
└── tests/hotActions.test.ts     # Tests unitaires
```

## Intégration dans GroupController

### Modification de `getById()`

Le endpoint existant `GET /api/groups/:id` retourne maintenant :

```json
{
  "message": "Groupe récupéré avec succès",
  "group": {
    "tasks": [
      {
        // ... propriétés existantes
        "hurryState": "maybe",
        "expectedActionsAtDate": 14,
        "actualActionsThisMonth": 12,
        "actionsLate": 2
      }
    ]
  },
  "hotActions": {
    "count": 3,
    "tasks": [ /* tâches en retard seulement */ ]
  }
}
```

### Nouvel endpoint dédié

```
GET /api/groups/:id/hot-actions
```

Retourne uniquement les tâches en retard pour un accès rapide.

## Optimisations performance

### Approche 1 : Requête optimisée (recommandée)

```typescript
// Une seule requête SQL avec COUNT agrégé
const tasksWithActionCounts = await AppDataSource
  .getRepository(Task)
  .createQueryBuilder('task')
  .leftJoin('task.actions', 'action', 'action.date >= :firstOfMonth')
  .addSelect('COUNT(action.id)', 'actionCount')
  .where('task.groupId = :groupId')
  .groupBy('task.id')
  .getRawAndEntities();
```

### Approche 2 : Version simple

```typescript
// 2 requêtes séparées puis calcul en mémoire
const tasks = await taskRepository.find({ where: { group: { id: groupId } } });
const actions = await actionRepository.find({ /* conditions mois */ });
```

## Tests

Des tests unitaires complets couvrent :
- Conversions de fréquence
- Calculs de ratio d'avancement
- Logique de détermination des états
- Cas limites et intégration

## Utilisation côté frontend

```typescript
// Récupérer un groupe avec Hot Actions
const { group, hotActions } = await groupRepository.getGroupById(groupId);

// Afficher le nombre de tâches en retard
console.log(`${hotActions.count} tâches en retard`);

// Filtrer les tâches par état
const urgentTasks = group.tasks.filter(task => task.hurryState === 'yes');
```

## Impact performance

✅ **Optimisé pour le chargement de la première page**
- Calculs intégrés dans les requêtes existantes
- Pas de N+1 queries
- Calculs mathématiques simples en mémoire
- Cache possible au niveau service

## Extensions possibles

1. **Cache Redis** pour les calculs fréquents
2. **Notifications push** pour les tâches critiques
3. **Tendances** d'évolution sur plusieurs mois
4. **Ajustements personnalisés** des seuils par utilisateur