# Implémentation de la création d'actions au clic sur TaskCard

## Vue d'ensemble

J'ai implémenté une nouvelle fonctionnalité permettant de créer une Action en cliquant sur une TaskCard. Cette implémentation respecte l'architecture existante et les règles métier définies côté API.

## Modifications apportées

### 1. Types API (`web-app/src/shared/types/api.ts`)
- ✅ Ajout du champ `isHelpingHand: boolean` à l'interface `Action`

### 2. TaskRepository (`web-app/src/data/repositories/taskRepository.ts`)
- ✅ Import des types `Action` et `CreateActionPayload`
- ✅ Nouvelle méthode `createAction(payload: CreateActionPayload)` qui appelle l'endpoint `/actions`

### 3. TasksStore (`web-app/src/domain/stores/tasksStore.ts`)
- ✅ Import des types `Action` et `CreateActionPayload`
- ✅ Nouvelle méthode `createActionForTask(taskId: number)` qui :
  - Crée automatiquement le payload avec la date actuelle
  - Appelle la méthode du repository
  - Gère les états de loading et d'erreur
  - Retourne le résultat de l'opération

### 4. TaskCard (`web-app/src/presentation/components/atoms/TaskCard.vue`)
- ✅ Ajout d'un événement `@click` sur la div principale
- ✅ Ajout de l'émission de l'événement `click`
- ✅ Styles CSS pour indiquer que la carte est cliquable :
  - `cursor: pointer`
  - Effet `transform: translateY(-2px)` au hover

### 5. TaskList (`web-app/src/presentation/components/molecules/TaskList.vue`)
- ✅ Propagation de l'événement `click` de TaskCard vers `task-click`
- ✅ Ajout de l'émission de l'événement `task-click` avec la tâche en paramètre

### 6. GroupDetailView (`web-app/src/presentation/views/GroupDetailView.vue`)
- ✅ Gestion de l'événement `@task-click` de TaskList
- ✅ Nouvelle méthode `handleTaskClick(task: Task)` qui :
  - Appelle `tasksStore.createActionForTask(task.id)`
  - Gère les cas de succès et d'erreur
  - Log les résultats (prêt pour des notifications)

## Fonctionnement côté API

L'API, dans le contrôleur `ActionController`, détermine automatiquement la valeur de `isHelpingHand` selon cette logique :

1. Vérifie si l'utilisateur est membre du groupe de la tâche
2. Recherche un `UserTaskState` pour voir si l'utilisateur `isConcerned` par cette tâche
3. Définit `isHelpingHand = !isUserConcerned` :
   - Si l'utilisateur est concerné → `isHelpingHand = false` (sa propre tâche)
   - Si l'utilisateur n'est pas concerné → `isHelpingHand = true` (coup de main)

## Utilisation

1. L'utilisateur voit les TaskCard dans la vue de détail d'un groupe
2. Un clic sur une TaskCard déclenche la création d'une action
3. L'action est automatiquement datée au moment du clic
4. Le serveur détermine si c'est un "coup de main" ou une tâche personnelle
5. L'action est sauvegardée avec toutes les relations (task, user, group)

## Gestion des erreurs

- Vérification de l'appartenance au groupe côté API
- Gestion des erreurs de validation
- Propagation des erreurs vers l'interface utilisateur
- États de loading pendant la création

## Points d'extension futurs

- Notifications toast pour le succès/échec
- Confirmation avant création d'action
- Historique des actions dans l'interface
- Statistiques en temps réel