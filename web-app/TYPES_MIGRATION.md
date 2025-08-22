# Migration des Types - Refactorisation

## ✅ Changements effectués

### Ancienne structure
```
/src/shared/types/api.ts (301 lignes)
├── Entités (User, Group, Task, Action, Tag, etc.)
├── Payloads (LoginPayload, CreateTaskPayload, etc.)
└── Responses (AuthResponse, CreateTaskResponse, etc.)
```

### Nouvelle structure
```
/src/domain/types/
├── entities/
│   ├── user.types.ts        # User, UserWithActions, UserTaskState
│   ├── group.types.ts       # Group, GroupStatistics
│   ├── task.types.ts        # Task, UniteFrequence
│   ├── action.types.ts      # Action + types overview complexes
│   └── tag.types.ts         # Tag
├── payloads/
│   ├── auth.payloads.ts     # LoginPayload, RegisterPayload
│   ├── group.payloads.ts    # CreateGroupPayload, JoinGroupPayload
│   ├── task.payloads.ts     # CreateTaskPayload, UpdateTaskPayload, UpdateUserTaskStatePayload
│   ├── action.payloads.ts   # CreateActionPayload
│   └── tag.payloads.ts      # CreateTagPayload
├── responses/
│   ├── auth.responses.ts    # AuthResponse, getProfileResponse
│   ├── group.responses.ts   # FetchGroupResponse, CreateGroupResponse, etc.
│   ├── task.responses.ts    # CreateTaskResponse, UpdateTaskResponse
│   ├── action.responses.ts  # CreateActionResponse, GetRecentActionsResponse
│   ├── overview.responses.ts # GetOverviewResponse, Overview, MonthlyVolumeItem, PersonalGoal
│   └── common.responses.ts  # ApiError
└── index.ts                 # Barrel export pour tous les types
```

## 🔄 Fichiers mis à jour (29 fichiers)

### Domain stores (4 fichiers)
- ✅ `domain/stores/authStore.ts`
- ✅ `domain/stores/groupStore.ts` 
- ✅ `domain/stores/tasksStore.ts`
- ✅ `domain/stores/statsStore.ts`

### Data repositories (4 fichiers)
- ✅ `data/repositories/authRepository.ts`
- ✅ `data/repositories/groupRepository.ts`
- ✅ `data/repositories/taskRepository.ts`
- ✅ `data/repositories/statsRepository.ts`
- ✅ `data/api/apiClient.ts`

### Presentation (21 fichiers)
- ✅ Toutes les vues (4 fichiers)
- ✅ Tous les composants molecules (13 fichiers)  
- ✅ Tous les composants atoms (3 fichiers)
- ✅ Composant organism (1 fichier)

## 💡 Avantages obtenus

1. **🎯 Séparation des responsabilités** : Chaque type a sa propre catégorie
2. **🔍 Navigation améliorée** : Plus facile de trouver un type spécifique
3. **⚡ Imports optimisés** : Import seulement ce qui est nécessaire
4. **🏗️ Architecture clean** : Respecte la structure domain/data/presentation
5. **👥 Collaboration** : Moins de conflits Git sur un gros fichier
6. **🧪 Maintenabilité** : Plus facile d'ajouter de nouveaux domaines

## 🚀 Utilisation

Tous les types restent accessibles via le barrel export :
```typescript
import type { User, LoginPayload, AuthResponse } from '@/domain/types'
```

## ⚠️ Notes importantes

- L'ancien fichier `shared/types/api.ts` peut être supprimé
- Tous les imports ont été mis à jour automatiquement
- La compilation TypeScript a été vérifiée ✅
- Aucune régression fonctionnelle introduite