# Pull Request: Refactor - Remove Unnecessary Emits

## 🎯 Objectif

Cette PR résout l'issue **CRE-195** en refactorisant les composants Vue qui comportent des `emit()` inutiles du fait de l'utilisation du store.

## 📋 Changements effectués

### ✅ Composants refactorisés pour utiliser les stores directement :

1. **`RegisterForm.vue`** - Utilise maintenant `useAuthStore().register()` directement
2. **`LoginForm.vue`** - Utilise maintenant `useAuthStore().login()` directement  
3. **`CreateTaskForm.vue`** - Utilise maintenant `useTasksStore().createTask()` directement
4. **`EditTaskForm.vue`** - Utilise maintenant `useTasksStore().updateTask()` directement
5. **`CreateTagForm.vue`** - Utilise maintenant `useTasksStore().createTag()` directement
6. **`CreateGroupForm.vue`** - Utilise maintenant `useGroupStore().createGroup()` directement
7. **`GroupCard.vue`** - Gère maintenant les actions join/leave directement via `useGroupStore()`

### 🔄 Vues simplifiées :

- **`RegisterView.vue`** - Suppression du handler `handleRegister`
- **`LoginView.vue`** - Suppression du handler `handleLogin`
- **`GroupDetailView.vue`** - Suppression des handlers `handleCreateTask`, `handleEditTask`, `handleCreateTag`
- **`GroupsView.vue`** - Suppression des handlers `handleCreateGroup`, `handleLeaveGroup`

## 🏗️ Architecture

### Avant :
```
Component → emit → View → Store
```

### Après :
```
Component → Store (direct)
```

## 🎨 Patterns utilisés

- **Callback props** : `onSuccess` et `onCancel` pour la gestion des modales
- **Store direct** : Les composants utilisent directement `useTasksStore()`, `useGroupStore()`, `useAuthStore()`
- **Gestion d'erreurs** : Les erreurs sont affichées via les propriétés du store (`store.error`, `store.isLoading`)

## ✅ Bénéfices

- 🧹 **Code plus propre** : Élimination des couches intermédiaires inutiles
- 🚀 **Performance** : Réduction du nombre d'événements émis
- 📦 **Maintenabilité** : Logique métier centralisée dans les stores
- 🔄 **Cohérence** : Pattern uniforme avec les composants existants (`TaskAcknowledgmentModal`, `ActionCard`)

## 🧪 Tests

- ✅ TypeScript compilation réussie
- ✅ Aucune erreur de type détectée
- ✅ Architecture cohérente avec les patterns existants

## 📁 Fichiers modifiés

- `web-app/src/presentation/components/molecules/RegisterForm.vue`
- `web-app/src/presentation/components/molecules/LoginForm.vue`
- `web-app/src/presentation/components/molecules/CreateTaskForm.vue`
- `web-app/src/presentation/components/molecules/EditTaskForm.vue`
- `web-app/src/presentation/components/molecules/CreateTagForm.vue`
- `web-app/src/presentation/components/molecules/CreateGroupForm.vue`
- `web-app/src/presentation/components/molecules/GroupCard.vue`
- `web-app/src/presentation/views/RegisterView.vue`
- `web-app/src/presentation/views/LoginView.vue`
- `web-app/src/presentation/views/GroupDetailView.vue`
- `web-app/src/presentation/views/GroupsView.vue`

## 🔗 Branch

**Branch:** `refactor/remove-unnecessary-emits`

**Pour créer la PR :**
1. Allez sur GitHub : https://github.com/DrivoireFR/Together/pull/new/refactor/remove-unnecessary-emits
2. Utilisez le titre : "refactor: remove unnecessary emits and use stores directly"
3. Copiez cette description dans le body de la PR
4. Assignez-vous la PR
5. Liez l'issue CRE-195

Closes CRE-195