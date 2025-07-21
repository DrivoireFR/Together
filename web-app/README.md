# Web App - Together Frontend

Application Vue.js 3 avec TypeScript pour l'interface utilisateur de Together, une app de gestion de tâches collaboratives.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd web-app
npm install
```

### 2. Configuration des variables d'environnement

**⚠️ IMPORTANT : Créez le fichier `.env.local` dans le dossier `web-app/`**

```bash
# Le fichier .env.local n'est pas commité dans Git (sécurité)
touch .env.local
```

**Contenu du fichier `.env.local` :**

```env
# === CONFIGURATION API ===
# URL de base de votre API backend
VITE_API_BASE_URL=http://localhost:3000/api

# === CONFIGURATION APPLICATION ===
# Nom de l'application (affiché dans l'interface)
VITE_APP_TITLE=Together - Gestion collaborative

# === CONFIGURATION DE DÉVELOPPEMENT ===
# Active les logs de développement (true/false)
VITE_DEBUG_MODE=true

# Délai d'auto-déconnexion en minutes (0 = désactivé)
VITE_AUTO_LOGOUT_DELAY=60

# === STOCKAGE LOCAL ===
# Préfixe pour les clés du localStorage
VITE_STORAGE_PREFIX=together_
```

### 3. Configuration selon l'environnement

#### 🛠️ Développement local
```env
# .env.local pour le développement
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
```

#### 🌐 Production
```env
# .env.production pour la production
VITE_API_BASE_URL=https://votre-api.exemple.com/api
VITE_DEBUG_MODE=false
VITE_AUTO_LOGOUT_DELAY=30
```

#### 🧪 Tests
```env
# .env.test pour les tests
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DEBUG_MODE=false
```

### 4. Démarrage de l'application

```bash
# Mode développement (avec hot reload)
npm run dev

# Compilation pour la production
npm run build

# Prévisualisation de la version compilée
npm run preview
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Variables d'environnement détaillées

### Variables obligatoires

| Variable | Description | Exemple | Importance |
|----------|-------------|---------|------------|
| `VITE_API_BASE_URL` | **URL de base de l'API backend** | `http://localhost:3000/api` | 🔴 **CRITIQUE** |

### Variables optionnelles

| Variable | Description | Valeur par défaut | Exemple |
|----------|-------------|-------------------|---------|
| `VITE_APP_TITLE` | Titre de l'application | `Together` | `Mon App Collaborative` |
| `VITE_DEBUG_MODE` | Mode debug (logs détaillés) | `false` | `true`, `false` |
| `VITE_AUTO_LOGOUT_DELAY` | Délai auto-déconnexion (min) | `0` (désactivé) | `30`, `60`, `120` |
| `VITE_STORAGE_PREFIX` | Préfixe localStorage | `together_` | `myapp_`, `prod_` |

## 🔧 Configuration avancée

### Fichiers d'environnement par priorité

Vite charge les fichiers dans cet ordre (du plus prioritaire au moins prioritaire) :

1. `.env.local` (toujours ignoré par Git)
2. `.env.development.local` (en mode développement)
3. `.env.production.local` (en mode production)
4. `.env.development` (en mode développement)
5. `.env.production` (en mode production)
6. `.env`

### Exemple de configuration multi-environnements

```bash
# Structure recommandée
web-app/
├── .env                    # Valeurs par défaut (commité)
├── .env.local             # Surcharges locales (ignoré par Git)
├── .env.development       # Spécifique au développement
├── .env.production        # Spécifique à la production
└── .env.example           # Template pour l'équipe
```

**`.env` (valeurs par défaut, commité) :**
```env
VITE_APP_TITLE=Together
VITE_DEBUG_MODE=false
VITE_AUTO_LOGOUT_DELAY=0
VITE_STORAGE_PREFIX=together_
```

**`.env.development` (développement) :**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
```

**`.env.production` (production) :**
```env
VITE_API_BASE_URL=https://api.together.com/api
VITE_DEBUG_MODE=false
VITE_AUTO_LOGOUT_DELAY=30
```

## 🎯 Fonctionnalités

- ✅ **Interface moderne** avec Vue 3 et Composition API
- ✅ **TypeScript** pour la sécurité des types
- ✅ **Authentification** avec gestion Remember Me
- ✅ **Gestion d'état** avec Pinia
- ✅ **Routing** avec Vue Router et guards
- ✅ **Design system** avec composants réutilisables
- ✅ **Gestion des groupes** collaboratifs
- ✅ **Interface des tâches** avec filtres et tags
- ✅ **Actions flottantes** pour création rapide
- ✅ **Responsive design** mobile-first

## 🏗️ Architecture

```
web-app/
├── src/
│   ├── data/              # Couche données (API, repositories)
│   │   ├── api/           # Client HTTP configuré
│   │   └── repositories/  # Interfaces avec l'API
│   ├── domain/            # Logique métier (stores Pinia)
│   │   └── stores/        # Gestion d'état globale
│   ├── presentation/      # Interface utilisateur
│   │   ├── components/    # Composants réutilisables
│   │   ├── layouts/       # Layouts (Auth, App)
│   │   └── views/         # Pages de l'application
│   ├── shared/            # Utilitaires et types partagés
│   │   ├── constants/     # Constantes globales
│   │   ├── types/         # Types TypeScript
│   │   └── utils/         # Fonctions utilitaires
│   └── router/            # Configuration des routes
├── .env.local            # Variables d'environnement (À CRÉER)
└── package.json
```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Compilation pour production
npm run preview          # Prévisualisation du build

# Qualité de code
npm run type-check       # Vérification TypeScript
npm run lint             # Linting avec ESLint
npm run lint --fix       # Correction automatique du linting
```

## 🌐 Points d'entrée principaux

### Pages d'authentification
- `/login` - Connexion
- `/register` - Inscription

### Pages principales (authentifiées)
- `/groups` - Liste des groupes
- `/groups/:id` - Détail d'un groupe avec tâches

### Navigation automatique
- Redirection vers `/groups` si connecté
- Redirection vers `/login` si non connecté

## ❌ Résolution des problèmes courants

### Erreur : "Failed to fetch" ou "Network Error"
```bash
# Solution : Vérifiez l'URL de l'API
echo $VITE_API_BASE_URL
# Doit pointer vers votre serveur API (ex: http://localhost:3000/api)
```

### Erreur : "401 Unauthorized" persistante
```bash
# Solution : Videz le localStorage et reconnectez-vous
# Dans les DevTools du navigateur :
localStorage.clear()
```

### Interface ne se connecte pas à l'API
```bash
# 1. Vérifiez que l'API est démarrée
curl http://localhost:3000/api/health

# 2. Vérifiez les variables d'environnement
cat .env.local

# 3. Redémarrez le serveur de développement
npm run dev
```

### Changement de variables d'environnement non pris en compte
```bash
# Les variables VITE_ nécessitent un redémarrage du serveur de dev
# Arrêtez (Ctrl+C) puis relancez :
npm run dev
```

## 🔐 Gestion de l'authentification

### Stockage des tokens
- **Token normal** : Stocké dans `localStorage` avec clé `${STORAGE_PREFIX}auth_token`
- **Données utilisateur** : Stockées avec clé `${STORAGE_PREFIX}user_data`

### Fonctionnalités Remember Me
- Token longue durée pour rester connecté
- Vérification automatique au démarrage de l'app
- Renouvellement transparent des tokens

### Auto-déconnexion
```env
# Déconnexion automatique après X minutes d'inactivité
VITE_AUTO_LOGOUT_DELAY=60  # 60 minutes
```

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 **Mobile** : 320px et plus
- 📱 **Tablette** : 768px et plus  
- 💻 **Desktop** : 1024px et plus

## 🎨 Personnalisation

### Thème et couleurs
Les couleurs sont définies dans `src/assets/main.css` avec des variables CSS :

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  /* ... autres couleurs */
}
```

### Titre de l'application
```env
# Personnalisez le titre affiché dans l'interface
VITE_APP_TITLE=Mon App Collaborative
```

## 🔗 Intégration avec l'API

### Configuration de base
```typescript
// src/shared/constants/index.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
```

### Gestion des erreurs API
- Intercepteurs pour les erreurs 401 (déconnexion automatique)
- Gestion centralisée des erreurs réseau
- Messages d'erreur utilisateur-friendly

## 🚀 Déploiement

### Variables d'environnement de production
```env
# .env.production
VITE_API_BASE_URL=https://votre-api-production.com/api
VITE_DEBUG_MODE=false
VITE_AUTO_LOGOUT_DELAY=30
```

### Build de production
```bash
# Compilation optimisée
npm run build

# Les fichiers sont générés dans dist/
ls dist/
```

## 📝 Notes importantes

1. **Préfixe VITE_** : Seules les variables commençant par `VITE_` sont exposées côté client
2. **Redémarrage requis** : Après modification des variables d'environnement
3. **Sécurité** : Ne mettez jamais de secrets dans les variables `VITE_` (visibles côté client)
4. **API_BASE_URL** : Doit correspondre à l'URL où votre API backend est accessible

## 🔗 Liens utiles

- [Documentation Vue 3](https://vuejs.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Variables d'environnement Vite](https://vitejs.dev/guide/env-and-mode.html)
