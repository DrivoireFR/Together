# 🎭 Configuration de la démo GitHub Pages

Cette documentation explique comment configurer et utiliser la version démo de l'application avec des données mockées sur GitHub Pages.

## 🚀 Mise en place

### 1. Configuration GitHub Pages

1. **Allez dans les paramètres de votre repository GitHub**
2. **Naviguez vers la section "Pages"**
3. **Sélectionnez "GitHub Actions" comme source**

### 2. Configuration du repository

1. **Modifiez le fichier `web-app/vite.config.ts`**
   - Remplacez `base: '/'` par `base: '/nom-de-votre-repo/'`
   - Remplacez `nom-de-votre-repo` par le nom exact de votre repository

2. **Le workflow GitHub Actions se déclenchera automatiquement** quand vous pushez sur la branche `main`

### 3. Test en local

Pour tester le mode démo localement :

```bash
cd web-app
npm run dev
```

L'application détectera automatiquement qu'elle est en mode démo et utilisera les données mockées.

## 🎯 Fonctionnalités du mode démo

### 🔐 Authentification
- **Email de demo** : `demo@example.com`
- **Mot de passe** : `demo123`
- Ou créez un nouveau compte (sera aussi simulé)

### 📊 Données disponibles
- **3 utilisateurs** : Alice Martin, Bob Dupont, Charlie Legrand
- **5 tâches** : Vaisselle, Aspirateur, Courses, Salle de bain, Dîner
- **3 tags** : Cuisine, Ménage, Courses
- **4 actions** récentes simulées
- **Statistiques** calculées dynamiquement

### ✨ Fonctionnalités interactives
- ✅ Création/modification/suppression de tâches
- ✅ Création/modification/suppression de tags
- ✅ Ajout d'actions
- ✅ Gestion des états utilisateur
- ✅ Statistiques en temps réel
- ✅ Persistance des données dans localStorage

## 🔧 Architecture technique

### Détection automatique du mode
L'application détecte automatiquement si elle est en mode démo selon :
- L'URL contient `github.io`, `pages.dev`, `netlify.app`, ou `vercel.app`
- La variable d'environnement `VITE_DEMO_MODE=true`

### Structure des mocks
```
web-app/src/data/mocks/
├── mockData.ts          # Données factices structurées
├── mockApiClient.ts     # Client API simulé
└── ...
```

### Repositories adaptatifs
```
web-app/src/data/repositories/
├── demoAwareRepositories.ts  # Repositories qui s'adaptent au mode
└── ...
```

## 📱 Test sur mobile

Une fois déployé sur GitHub Pages, vous pouvez tester l'application sur votre téléphone :

1. **Obtenez l'URL GitHub Pages** : `https://votre-nom-utilisateur.github.io/nom-de-votre-repo/`
2. **Ouvrez cette URL sur votre téléphone**
3. **Connectez-vous avec** : `demo@example.com` / `demo123`

## 🛠️ Personnalisation

### Modifier les données de démo
Éditez `web-app/src/data/mocks/mockData.ts` pour :
- Ajouter des utilisateurs
- Créer de nouvelles tâches
- Modifier les tags
- Ajouter des actions

### Ajouter de nouvelles fonctionnalités
1. Ajoutez la méthode dans `mockApiClient.ts`
2. Ajoutez la logique dans `demoAwareRepositories.ts`
3. Les données seront automatiquement persistées en localStorage

## 🔄 Workflow de déploiement

### Déploiement automatique
- **Push sur `main`** → Build automatique → Déploiement sur GitHub Pages
- **Pull Request** → Build de vérification (pas de déploiement)

### Déploiement manuel
```bash
cd web-app
npm run build
# Les fichiers sont générés dans le dossier `dist/`
```

## 🐛 Dépannage

### Build échoue
- Vérifiez que Node.js 20+ est utilisé
- Vérifiez que `npm ci` s'exécute correctement
- Consultez les logs dans l'onglet "Actions" de GitHub

### Application ne charge pas
- Vérifiez que le `base` dans `vite.config.ts` correspond au nom du repository
- Vérifiez que GitHub Pages est configuré sur "GitHub Actions"

### Données ne se chargent pas
- Ouvrez la console du navigateur
- Vérifiez que vous voyez le message "🎭 Mode démo activé"
- Vérifiez que les données sont dans localStorage

## 🎨 Personnalisation avancée

### Thème et branding
- Modifiez `web-app/src/assets/` pour les ressources
- Adaptez les couleurs dans les composants Vue
- Personnalisez les icônes et émojis dans `mockData.ts`

### Ajout de nouvelles pages
1. Créez les composants Vue dans `web-app/src/presentation/`
2. Ajoutez les routes dans `web-app/src/router/`
3. Mettez à jour les mocks si nécessaire

## 📈 Métriques et analytics

Pour suivre l'utilisation de votre démo :
- Ajoutez Google Analytics dans `web-app/index.html`
- Consultez les statistiques GitHub Pages
- Surveillez les logs dans la console du navigateur

## 🔒 Sécurité

⚠️ **Important** : Cette configuration est pour la démonstration uniquement
- Les données sont factices et publiques
- Aucune donnée sensible ne doit être incluse
- Les tokens sont simulés et non sécurisés

## 🤝 Contribution

Pour contribuer aux mocks ou à la configuration :
1. Modifiez les fichiers dans `web-app/src/data/mocks/`
2. Testez localement avec `npm run dev`
3. Créez une Pull Request