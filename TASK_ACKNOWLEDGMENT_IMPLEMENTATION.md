# Implémentation de la reconnaissance des tâches utilisateur

## Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de prendre connaissance des nouvelles tâches ajoutées dans un groupe et d'indiquer s'ils se sentent concernés par chaque tâche. Une modale s'affiche automatiquement lors de l'accès à un groupe si l'utilisateur n'a pas encore pris connaissance de certaines tâches.

## Entités modifiées

### API

#### Entité UserTaskState
- **Fichier**: `nest-api/src/entities/UserTaskState.ts`
- **Propriétés principales**:
  - `isAcknowledged`: boolean - L'utilisateur a-t-il pris connaissance de la tâche
  - `isConcerned`: boolean - L'utilisateur se sent-il concerné par la tâche
  - `acknowledgedAt`: Date - Date de prise de connaissance
  - `concernedAt`: Date - Date de décision de se sentir concerné

#### Contrôleur UserTaskStateController
- **Fichier**: `nest-api/src/controllers/UserTaskStateController.ts`
- **Méthodes**:
  - `updateTaskState(taskId)`: Met à jour l'état d'une tâche pour l'utilisateur
  - `getUserTaskStates(groupId)`: Récupère tous les états des tâches d'un groupe pour l'utilisateur

#### Routes
- **Fichier**: `nest-api/src/routes/userTaskStates.ts`
- `PUT /api/user-task-states/:taskId` - Mettre à jour l'état d'une tâche
- `GET /api/user-task-states/group/:groupId` - Récupérer les états des tâches d'un groupe

#### Modification du TaskController
- **Fichier**: `nest-api/src/controllers/TaskController.ts`
- La méthode `getByGroupId` enrichit maintenant les tâches avec l'état utilisateur (`userTaskState`)

### Frontend

#### Types
- **Fichier**: `web-app/src/shared/types/api.ts`
- Ajout de l'interface `UserTaskState`
- Ajout de l'interface `UpdateUserTaskStatePayload`
- Modification de l'interface `Task` pour inclure `userTaskState`

#### Repository
- **Fichier**: `web-app/src/data/repositories/taskRepository.ts`
- Ajout des méthodes:
  - `updateUserTaskState(taskId, payload)`: Met à jour l'état d'une tâche
  - `getUserTaskStates(groupId)`: Récupère les états des tâches d'un groupe

#### Store des tâches
- **Fichier**: `web-app/src/domain/stores/tasksStore.ts`
- **Nouveaux états**:
  - `unacknowledgedTasks`: Liste des tâches non reconnues
  - `currentUnacknowledgedTaskIndex`: Index de la tâche actuelle dans la modale
  - `showTaskAcknowledgmentModal`: Affichage de la modale

- **Nouveaux getters**:
  - `currentUnacknowledgedTask`: Tâche actuellement affichée dans la modale
  - `hasUnacknowledgedTasks`: Y a-t-il des tâches non reconnues
  - `isLastUnacknowledgedTask`: Est-ce la dernière tâche non reconnue

- **Nouvelles actions**:
  - `acknowledgeTask(taskId, isConcerned)`: Marque une tâche comme reconnue
  - `handleTaskDecision(isConcerned)`: Gère la décision de l'utilisateur
  - `closeTaskAcknowledgmentModal()`: Ferme la modale
  - `skipTaskAcknowledgment()`: Passe à la tâche suivante sans décision

#### Composant modale
- **Fichier**: `web-app/src/presentation/components/molecules/TaskAcknowledgmentModal.vue`
- Interface moderne avec:
  - Affichage des informations de la tâche (nom, fréquence, tag)
  - Boutons "Non concerné" et "Je suis concerné"
  - Compteur de progression (X / Y)
  - Option pour passer temporairement
  - Bouton de fermeture

#### Intégration dans GroupDetailView
- **Fichier**: `web-app/src/presentation/views/GroupDetailView.vue`
- Ajout de la modale `TaskAcknowledgmentModal`
- La modale s'affiche automatiquement quand `showTaskAcknowledgmentModal` est true

## Flux d'utilisation

1. **Accès au groupe**: L'utilisateur navigue vers la vue d'un groupe
2. **Chargement des données**: `fetchGroupData(groupId)` est appelé
3. **Détection des tâches non reconnues**: Le store filtre les tâches où `userTaskState` est null ou `isAcknowledged` est false
4. **Affichage de la modale**: Si des tâches non reconnues existent, la modale s'ouvre automatiquement
5. **Traitement tâche par tâche**:
   - L'utilisateur voit les informations de la tâche
   - Il choisit "Non concerné" ou "Je suis concerné"
   - L'état est sauvegardé via l'API
   - Passage à la tâche suivante ou fermeture si dernière tâche
6. **Options supplémentaires**:
   - "Passer pour le moment" : passe à la tâche suivante sans sauvegarder
   - Bouton fermer : ferme la modale complètement

## Payloads API

### UpdateUserTaskStatePayload
```typescript
{
  isAcknowledged?: boolean  // Prise de connaissance
  isConcerned?: boolean     // Se sent concerné
}
```

### Réponse userTaskState
```typescript
{
  id: number
  taskId: number
  userId: number
  isAcknowledged: boolean
  isConcerned: boolean
  acknowledgedAt?: string
  concernedAt?: string
  createdAt: string
  updatedAt: string
}
```

## Avantages de cette implémentation

1. **UX fluide**: La modale apparaît automatiquement sans action utilisateur
2. **Progression claire**: L'utilisateur voit combien de tâches restent à traiter
3. **Flexibilité**: Possibilité de passer ou fermer à tout moment
4. **Persistance**: Les choix sont sauvegardés immédiatement
5. **Performance**: Utilisation de la logique existante du store
6. **Extensibilité**: Facile d'ajouter d'autres états ou actions

## Prochaines améliorations possibles

1. **Notifications**: Notifier quand de nouvelles tâches sont ajoutées
2. **Paramètres utilisateur**: Permettre de désactiver la modale automatique
3. **Historique**: Voir l'historique des décisions prises
4. **Bulk actions**: Traiter plusieurs tâches à la fois
5. **Rappels**: Système de rappels pour les tâches passées