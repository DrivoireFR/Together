# Frontend Web App - Gestion de Groupes

Application frontend Vue.js avec TypeScript pour la gestion de groupes collaboratifs.

## 🏗️ Architecture

Cette application suit une architecture **Data Domain Presentation (DDP)** avec **Atomic Design** pour les composants.

### Structure des dossiers

```
src/
├── data/                    # Couche Data
│   ├── api/                 # Clients API
│   ├── models/              # Modèles de données
│   └── repositories/        # Repositories pour l'accès aux données
├── domain/                  # Couche Domain (Métier)
│   ├── entities/            # Entités métier
│   ├── services/            # Services métier
│   └── stores/              # Stores Pinia (gestion d'état)
├── presentation/            # Couche Presentation
│   ├── components/          # Composants Vue.js
│   │   ├── atoms/           # Composants atomiques (boutons, inputs)
│   │   ├── molecules/       # Composants moléculaires (formulaires)
│   │   ├── organisms/       # Composants organismes (sections complexes)
│   │   └── templates/       # Templates de page
│   ├── views/               # Vues/Pages
│   └── layouts/             # Layouts d'application
└── shared/                  # Code partagé
    ├── types/               # Types TypeScript
    ├── utils/               # Utilitaires
    └── constants/           # Constantes
```

## 🚀 Technologies

- **Vue 3** avec Composition API et `<script setup>`
- **TypeScript** pour le typage statique
- **Pinia** pour la gestion d'état
- **Vue Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Axios** pour les requêtes HTTP
- **Vite** comme bundler

## ✨ Fonctionnalités

### Authentification
- [x] Connexion utilisateur
- [x] Gestion des tokens JWT
- [x] Persistance de l'authentification
- [x] Guards de navigation

### Gestion des Groupes
- [x] Affichage des groupes de l'utilisateur
- [x] Création de nouveaux groupes
- [x] Recherche de groupes par nom
- [x] Rejoindre un groupe
- [x] Quitter un groupe

### Architecture Technique
- [x] Classe abstraite `DataResult` pour la gestion des erreurs API
- [x] Stores Pinia pour la logique métier
- [x] Composants atomiques réutilisables
- [x] Séparation claire des responsabilités
- [x] Types TypeScript complets

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

### Variables d'environnement
Créer un fichier `.env.local` :
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📋 API Endpoints Utilisés

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /users/me` - Profil utilisateur

### Groupes
- `GET /groups` - Liste des groupes de l'utilisateur
- `POST /groups` - Créer un groupe
- `GET /groups/search/name?nom=...` - Rechercher des groupes
- `POST /groups/:id/join` - Rejoindre un groupe
- `POST /groups/:id/leave` - Quitter un groupe

## 🎨 Design System

### Composants Atomiques

**BaseButton**
- Variants : `primary`, `secondary`, `danger`, `outline`, `ghost`
- Tailles : `sm`, `md`, `lg`
- Props : `loading`, `disabled`, `iconBefore`, `iconAfter`

**BaseInput**
- Types : `text`, `email`, `password`, `number`, etc.
- Props : `label`, `error`, `helpText`, `iconBefore`, `iconAfter`

**BaseCard**
- Variants : `default`, `elevated`, `outlined`, `flat`
- Props : `title`, `hover`, `clickable`

### Composants Moléculaires

**LoginForm**
- Validation côté client
- Gestion des erreurs
- États de loading

**GroupCard**
- Affichage des informations du groupe
- Actions (rejoindre/quitter)
- Prévisualisation des membres

## 🔧 Configuration

### Tailwind CSS
Configuration dans `tailwind.config.js` avec :
- Plugin `@tailwindcss/forms`
- Classes utilitaires personnalisées

### TypeScript
Configuration stricte avec chemins absolus (`@/` pour `src/`)

### ESLint
Règles de linting configurées pour Vue 3 + TypeScript

## 🏛️ Patterns Architecturaux

### DataResult Pattern
```typescript
// Gestion uniforme des succès/erreurs
export abstract class DataResult<T> {
  abstract readonly isSuccess: boolean
  abstract readonly isError: boolean
}

export class DataSuccess<T> extends DataResult<T> {
  constructor(public readonly data: T) { super() }
}

export class DataError<T> extends DataResult<T> {
  constructor(public readonly message: string) { super() }
}
```

### Repository Pattern
```typescript
// Abstraction de l'accès aux données
export class AuthRepository {
  async login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', payload)
  }
}
```

### Store Pattern (Pinia)
```typescript
// Gestion d'état réactive avec Composition API
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (payload: LoginPayload) => {
    // Logique métier
  }
  
  return { user, isAuthenticated, login }
})
```

## 🔐 Sécurité

- Tokens JWT stockés dans localStorage
- Intercepteurs Axios pour l'authentification automatique
- Guards de navigation pour protéger les routes
- Validation côté client avec feedback utilisateur
- Nettoyage automatique en cas de token expiré

## 🎯 Prochaines Étapes

- [ ] Formulaire d'inscription
- [ ] Gestion des tâches
- [ ] Gestion des tags
- [ ] Actions sur les tâches
- [ ] Statistiques et tableaux de bord
- [ ] Notifications temps réel
- [ ] Mode sombre
- [ ] Tests unitaires et e2e

## 🤝 Contribution

1. Respecter l'architecture DDP
2. Suivre les patterns Atomic Design
3. Typer toutes les interfaces
4. Aucune logique métier dans les vues
5. Utiliser les stores pour la gestion d'état
6. Tester les composants critiques

## 📝 Notes Techniques

- L'application utilise la Composition API exclusivement
- Tous les composants utilisent `<script setup lang="ts">`
- La logique métier est centralisée dans les stores Pinia
- Les composants sont purement présentationnels
- L'API est typée de bout en bout avec TypeScript
