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
- **CSS Vanilla** avec variables CSS custom pour le styling
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

## 🎨 Design System avec CSS Vanilla

### Variables CSS Custom

L'application utilise un système de design basé sur des variables CSS custom définies dans `src/assets/main.css` :

#### Couleurs
```css
:root {
  /* Couleurs principales */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #dbeafe;
  
  /* Couleurs d'état */
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  
  /* Couleurs neutres */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  /* ... */
}
```

#### Espacement
```css
:root {
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  /* ... */
}
```

#### Typographie
```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  /* ... */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

### Composants Stylés

**BaseButton**
- Classes CSS scoped avec variantes (`btn--primary`, `btn--secondary`, etc.)
- Gestion des états (hover, disabled, loading)
- Tailles configurables (`btn--sm`, `btn--md`, `btn--lg`)

**BaseInput**
- Styles cohérents avec validation d'erreur
- Support des icônes avant/après
- États focus et disabled

**BaseCard**
- Système de cartes avec variantes d'ombres
- Support hover et clickable
- Header et footer optionnels

### Utilitaires CSS

L'application inclut des classes utilitaires similaires à Tailwind mais utilisant les variables CSS :

```css
.flex { display: flex; }
.grid { display: grid; }
.text-center { text-align: center; }
.bg-white { background-color: var(--color-white); }
.text-gray-500 { color: var(--color-gray-500); }
.p-4 { padding: var(--spacing-4); }
.mt-2 { margin-top: var(--spacing-2); }
/* ... */
```

## 🔧 Configuration

### CSS Vanilla
- Variables CSS custom dans `src/assets/main.css`
- Composants avec styles scoped
- Utilitaires réutilisables basés sur les variables
- Responsive design avec media queries

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

### Component Styling Pattern
```vue
<!-- Composant avec styles scoped -->
<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup lang="ts">
const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`
].join(' '))
</script>

<style scoped>
.btn {
  /* Styles de base utilisant les variables CSS */
  background-color: var(--color-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
}

.btn--primary {
  background-color: var(--color-primary);
}

.btn--sm {
  padding: var(--spacing-1) var(--spacing-3);
}
</style>
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
- [ ] Mode sombre (facilité par les variables CSS)
- [ ] Tests unitaires et e2e

## 🤝 Contribution

1. Respecter l'architecture DDP
2. Suivre les patterns Atomic Design
3. Typer toutes les interfaces
4. Aucune logique métier dans les vues
5. Utiliser les stores pour la gestion d'état
6. Utiliser les variables CSS pour tous les styles
7. Préférer les styles scoped aux classes globales
8. Tester les composants critiques

## 📝 Notes Techniques

- L'application utilise la Composition API exclusivement
- Tous les composants utilisent `<script setup lang="ts">`
- La logique métier est centralisée dans les stores Pinia
- Les composants sont purement présentationnels
- L'API est typée de bout en bout avec TypeScript
- **CSS Vanilla** avec variables custom pour un contrôle total du styling
- Système de design cohérent et maintenable
- Performance optimisée sans framework CSS externe

## 🎨 Migration CSS

Cette application a été migrée de **Tailwind CSS** vers **CSS Vanilla** avec variables custom pour :

### Avantages
- ✅ **Contrôle total** : Pas de dépendance externe pour le styling
- ✅ **Performance** : CSS plus léger et optimisé
- ✅ **Maintenabilité** : Variables CSS centralisées et cohérentes
- ✅ **Flexibilité** : Styles custom sans contraintes de framework
- ✅ **Bundle size** : Réduction significative de la taille du bundle

### Structure CSS
- Variables CSS dans `main.css` pour toutes les valeurs design
- Composants avec styles scoped pour l'encapsulation
- Classes utilitaires réutilisables basées sur les variables
- Responsive design natif avec media queries
