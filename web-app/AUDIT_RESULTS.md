# Résultats de l'Audit Front-End - Code Non Utilisé

## Phase 1 : Audit des Stores

### authStore.ts

#### Méthodes/États non utilisés :
- `userEmail` (computed) - Non utilisé dans le codebase
- `isEmailVerified` (computed) - Non utilisé dans le codebase
- `fetchProfile` - Non utilisé (méthode exportée mais jamais appelée)
- `clearError` - Non utilisé (jamais appelé depuis l'extérieur du store)

#### Méthodes utilisées :
- `initializeAuth` - Utilisé dans main.ts
- `login` - Utilisé dans LoginForm.vue
- `register` - Utilisé dans RegisterForm.vue
- `logout` - Utilisé dans AccountView.vue, Header.vue, ConfirmEmailView.vue
- `updateProfile` - Utilisé dans ProfileView.vue, ProfileSection.vue
- `resendConfirmation` - Utilisé dans ProfileView.vue, ProfileSection.vue, ConfirmEmailView.vue
- `changePassword` - Utilisé dans PasswordChangeForm.vue
- `userName` - Utilisé dans Header.vue
- `isAuthenticated` - Utilisé dans router/index.ts, ConfirmEmailView.vue

### groupStore.ts

#### Méthodes/États non utilisés :
- `groupsCount` (computed) - Non utilisé
- `currentGroupName` (computed) - Non utilisé
- `clearCurrentGroup` - Non utilisé
- `clearError` - Non utilisé (jamais appelé depuis l'extérieur)

#### Méthodes utilisées :
- Toutes les autres méthodes sont utilisées

### statsStore.ts

#### Méthodes/États non utilisés :
- `isLoading` - Non utilisé directement (seulement via computed dans GroupStatsView)
- `error` - Non utilisé

#### Méthodes utilisées :
- `fetchOverview` - Utilisé dans GroupStatsView.vue
- `clearStats` - Utilisé dans authStore.logout
- `hasOverview` - Utilisé dans GroupStatsView.vue
- `overview` - Utilisé dans GroupStatsView.vue
- `totalMonthlyPoints`, `completionPercentage`, `topPerformers`, `helpingHandsCount`, `personalGoals` - Utilisés dans GroupStatsView.vue

### tasksStore.ts

#### Méthodes/États non utilisés :
- `statistics` (ref) - Non utilisé (jamais assigné ni lu)
- `currentTask` (ref) - Non utilisé (jamais assigné ni lu)
- `clearCurrentTask` - Non utilisé
- `clearError` - Non utilisé (jamais appelé depuis l'extérieur)
- `fetchTags` - Non utilisé (jamais appelé)

#### Méthodes utilisées :
- Toutes les autres méthodes sont utilisées

---

## Phase 2 : Audit des Composants

### Atoms non utilisés :

1. **StatCard.vue** - Composant non importé ni utilisé dans aucun fichier

### Atoms utilisés :
- ActionCard, Avatar, BaseButton, BaseCard, BaseInput, BaseModal, BaseSlider, Icon, LoaderWithSpinner, ProgressBar, TagButton, TagChip, TaskCard - Tous utilisés

### Molecules non utilisées :

1. **ProfileSection.vue** - Non importé ni utilisé
2. **FloatingActionPanel.vue** - Non importé ni utilisé
3. **UserStatsCard.vue** - Non importé ni utilisé
4. **TagStatsCard.vue** - Non importé ni utilisé

### Molecules utilisées :
- Toutes les autres molecules sont utilisées

### Organisms non utilisés :

1. **HistoryPanel.vue** - Non importé ni utilisé

### Composants Icons non utilisés (dans `src/components/icons/`) :

1. **IconCommunity.vue** - Non utilisé
2. **IconDocumentation.vue** - Non utilisé
3. **IconEcosystem.vue** - Non utilisé
4. **IconSupport.vue** - Non utilisé
5. **IconTooling.vue** - Non utilisé

---

## Phase 3 : Audit des Routes et Views

### Résultat :
✅ **Toutes les views sont référencées dans le router**
- Toutes les 22 views existantes sont correctement référencées dans `router/index.ts`
- Aucune view orpheline détectée

---

## Phase 4 : Audit des Types et Utilitaires

### Composables :
✅ **useConfirmModal** - Utilisé dans :
- tasksStore.ts
- ActionCard.vue
- TaskSwipeCard.vue
- GroupAddTask.vue
- GroupAddTag.vue

### Constants :

#### Non utilisées :
- `ROUTES` - Défini mais jamais utilisé (les routes sont hardcodées dans le router)
- `HTTP_STATUS` - Défini mais jamais utilisé (les codes HTTP ne sont pas vérifiés dans le code)

#### Utilisées :
- `STORAGE_KEYS` - Utilisé dans authStore, groupStore, apiClient
- `API_BASE_URL` - Utilisé dans apiClient
- `STORAGE_PREFIX` - Utilisé dans storage.ts
- `difficultyDescriptions` - Utilisé dans BaseSlider.vue et TaskCard.vue

---

## Phase 5 : Audit du CSS

### Variables CSS :
⚠️ **Audit partiel** - Les variables CSS sont nombreuses (100+) et nécessitent une vérification manuelle approfondie. Beaucoup sont utilisées via les classes utilitaires.

### Classes utilitaires :
⚠️ **Audit partiel** - Les classes utilitaires sont nombreuses et nécessitent une vérification manuelle. Beaucoup sont utilisées dans les templates Vue.

### Sélecteurs personnalisés :
- `.wrapper` dans base.css - Utilisé
- `.container` dans main.css - À vérifier
- `.visually-hidden` dans main.css - À vérifier

---

## Résumé - Code Supprimé ✅

### Composants supprimés :
- ✅ StatCard.vue (atom)
- ✅ ProfileSection.vue (molecule)
- ✅ FloatingActionPanel.vue (molecule)
- ✅ UserStatsCard.vue (molecule)
- ✅ TagStatsCard.vue (molecule)
- ✅ HistoryPanel.vue (organism)
- ✅ IconCommunity.vue, IconDocumentation.vue, IconEcosystem.vue, IconSupport.vue, IconTooling.vue (icons)

### Stores nettoyés :
- ✅ authStore : userEmail, isEmailVerified, fetchProfile, clearError supprimés
- ✅ groupStore : groupsCount, currentGroupName, clearCurrentGroup, clearError supprimés
- ✅ tasksStore : statistics, currentTask, clearCurrentTask, clearError, fetchTags, hasStatistics supprimés

### Constants nettoyées :
- ✅ ROUTES supprimé (non utilisé)

---

## Résumé - Code à Supprimer (Ancien)

### Stores (méthodes/états à retirer) :

**authStore.ts :**
- `userEmail` (computed)
- `isEmailVerified` (computed)
- `fetchProfile` (méthode)
- `clearError` (méthode)

**groupStore.ts :**
- `groupsCount` (computed)
- `currentGroupName` (computed)
- `clearCurrentGroup` (méthode)
- `clearError` (méthode)

**statsStore.ts :**
- `isLoading` (ref) - À vérifier si utilisé indirectement
- `error` (ref) - À vérifier si utilisé indirectement

**tasksStore.ts :**
- `statistics` (ref)
- `currentTask` (ref)
- `clearCurrentTask` (méthode)
- `clearError` (méthode)
- `fetchTags` (méthode)

### Composants à supprimer :

**Atoms :**
- `StatCard.vue`

**Molecules :**
- `ProfileSection.vue`
- `FloatingActionPanel.vue`
- `UserStatsCard.vue`
- `TagStatsCard.vue`

**Organisms :**
- `HistoryPanel.vue`

**Icons (dans src/components/icons/) :**
- `IconCommunity.vue`
- `IconDocumentation.vue`
- `IconEcosystem.vue`
- `IconSupport.vue`
- `IconTooling.vue`

### Constants à supprimer :

**shared/constants/index.ts :**
- `ROUTES` (objet entier) - ✅ Supprimé

**Note :** `HTTP_STATUS` est utilisé dans `apiClient.ts`, donc conservé.

---

## Notes

- L'audit CSS nécessite une vérification plus approfondie avec des outils spécialisés (purgecss)
- Certaines méthodes de stores peuvent être utilisées indirectement via des computed ou des watchers
- Vérifier les dépendances avant suppression
