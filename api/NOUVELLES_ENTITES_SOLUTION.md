# Documentation des nouvelles modifications

## Modifications apportées

### 1. Ajout de la propriété `points` à l'entité Task

**Localisation** : `api/src/entities/Task.ts`

```typescript
@Column({ type: 'int', default: 0 })
@IsPositive()
points: number;
```

**Justification** : Simple ajout d'une propriété entière pour gérer un système de points par tâche.

### 2. Gestion des relations `concernedTasks` et `acknowledgedTasks`

**Solution adoptée** : Création d'une nouvelle entité `UserTaskState`

**Localisation** : `api/src/entities/UserTaskState.ts`

#### Pourquoi cette approche ?

Au lieu d'ajouter directement des relations Many-to-Many sur l'entité User, j'ai créé une entité intermédiaire `UserTaskState` pour les raisons suivantes :

1. **Séparation des responsabilités** : Une entité dédiée pour gérer l'état des tâches par utilisateur
2. **Évolutivité** : Facilite l'ajout de nouveaux états ou métadonnées
3. **Performance** : Meilleure indexation et requêtes plus efficaces
4. **Auditabilité** : Traçabilité des dates de modification (`acknowledgedAt`, `concernedAt`)
5. **Intégrité des données** : Contrainte unique (`user`, `task`) pour éviter les doublons

#### Structure de l'entité UserTaskState

```typescript
@Entity()
@Unique(['user', 'task'])
export class UserTaskState {
  id: number;
  user: User;                    // Référence vers l'utilisateur
  task: Task;                    // Référence vers la tâche
  isAcknowledged: boolean;       // Si l'utilisateur a vu la tâche
  isConcerned: boolean;          // Si l'utilisateur se sent concerné
  acknowledgedAt?: Date;         // Date de prise de connaissance
  concernedAt?: Date;            // Date de marquage comme concerné
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relations ajoutées

- **User** : Relation `OneToMany` vers `UserTaskState`
- **Task** : Relation `OneToMany` vers `UserTaskState`

#### Avantages de cette solution

1. **Historique complet** : Possibilité de savoir quand un utilisateur a marqué une tâche
2. **Flexibilité** : Ajout facile de nouveaux états (ex: `isPriority`, `isArchived`)
3. **Performance** : Requêtes optimisées avec index sur (`user`, `task`)
4. **Cohérence** : Évite la duplication des données
5. **Maintenabilité** : Code plus propre et relations plus claires

#### Utilisation

```typescript
// Récupérer les tâches que l'utilisateur a vues
const acknowledgedTasks = await userTaskStateRepository.find({
  where: { user: { id: userId }, isAcknowledged: true },
  relations: ['task']
});

// Récupérer les tâches qui concernent l'utilisateur
const concernedTasks = await userTaskStateRepository.find({
  where: { user: { id: userId }, isConcerned: true },
  relations: ['task']
});

// Marquer une tâche comme vue
await userTaskStateRepository.save({
  user: { id: userId },
  task: { id: taskId },
  isAcknowledged: true,
  acknowledgedAt: new Date()
});
```

### 3. Entité TaskBundle

**Localisation** : `api/src/entities/TaskBundle.ts`

#### Objectif

Permettre l'enregistrement groupé de tâches avec des métadonnées communes.

#### Structure

```typescript
@Entity()
export class TaskBundle {
  id: number;
  label: string;                 // Nom du bundle
  description?: string;          // Description optionnelle
  tasks: Task[];                 // Tâches incluses dans le bundle
  createdBy: User;               // Utilisateur créateur
  group: Group;                  // Groupe auquel appartient le bundle
  createdAt: Date;
  updatedAt: Date;
}
```

#### Avantages

1. **Atomicité** : Possibilité d'enregistrer plusieurs tâches en une seule transaction
2. **Organisation** : Regroupement logique de tâches liées
3. **Traçabilité** : Suivi de qui a créé le bundle et dans quel groupe
4. **Flexibilité** : Possibilité d'ajouter des métadonnées au niveau du bundle

#### Utilisation

```typescript
// Créer un bundle avec plusieurs tâches
const taskBundle = new TaskBundle();
taskBundle.label = "Tâches de nettoyage";
taskBundle.description = "Tâches hebdomadaires de maintenance";
taskBundle.tasks = [task1, task2, task3];
taskBundle.createdBy = user;
taskBundle.group = group;

await taskBundleRepository.save(taskBundle);
```

## Fichiers modifiés

1. **api/src/entities/Task.ts** : Ajout de la propriété `points`
2. **api/src/entities/User.ts** : Ajout de la relation `taskStates`
3. **api/src/entities/UserTaskState.ts** : Nouvelle entité (créée)
4. **api/src/entities/TaskBundle.ts** : Nouvelle entité (créée)
5. **api/src/config/database.ts** : Ajout des nouvelles entités dans la configuration

## Prochaines étapes recommandées

1. **Créer les repositories** pour les nouvelles entités
2. **Développer les routes API** pour gérer les nouvelles fonctionnalités
3. **Créer les controllers** correspondants
4. **Ajouter les validations** et middleware nécessaires
5. **Écrire les tests** pour les nouvelles fonctionnalités
6. **Mettre à jour la documentation API**

## Base de données

Les nouvelles tables créées automatiquement par TypeORM :
- `user_task_state` : Pour gérer les états des tâches par utilisateur
- `task_bundle` : Pour les bundles de tâches
- `task_bundle_tasks_task` : Table de liaison Many-to-Many pour TaskBundle-Task

## Migration

En développement, les tables seront créées automatiquement grâce à `synchronize: true`. En production, il est recommandé de créer des migrations TypeORM pour ces nouvelles entités.