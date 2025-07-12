# 🧪 Guide - Branche de Test GitHub Pages

## 🎯 Configuration pour le repository "Together"

J'ai configuré le projet pour votre repository **https://github.com/DrivoireFR/Together** avec support de la branche de test.

## 🚀 Déploiement Express

### Option 1 : Script automatique
```bash
./setup-test-branch.sh
```

### Option 2 : Étapes manuelles
```bash
# Créer et basculer vers la branche de test
git checkout -b test-mockup

# Ajouter les fichiers
git add .

# Commit
git commit -m "Configure GitHub Pages demo with mockup data"

# Pousser la branche
git push -u origin test-mockup
```

## ⚙️ Configuration GitHub Pages

1. **Allez sur** : https://github.com/DrivoireFR/Together/settings/pages
2. **Sélectionnez** : "GitHub Actions" comme source
3. **Sauvegardez** les paramètres

## 🌐 URLs de Démo

- **Depuis main** : https://drivoirefr.github.io/Together/
- **Depuis test-mockup** : https://drivoirefr.github.io/Together/

## 🔧 Branches Configurées

### **Branche `main`**
- Déploiement automatique sur push
- Version stable de la démo

### **Branche `test-mockup`**
- Déploiement automatique sur push
- Branche de test pour nouvelles fonctionnalités
- Isolée de la version main

## 🔄 Workflow de Développement

### **Travailler sur la démo**
```bash
# Basculer vers la branche de test
git checkout test-mockup

# Faire des modifications
# ... éditer les fichiers ...

# Pousser les changements
git add .
git commit -m "Update demo features"
git push origin test-mockup
```

### **Fusionner vers main**
```bash
# Quand la démo est prête
git checkout main
git merge test-mockup
git push origin main
```

## 📱 Test sur Mobile

Une fois déployé, testez sur votre téléphone :
- **URL** : https://drivoirefr.github.io/Together/
- **Email** : demo@example.com
- **Mot de passe** : demo123

## 🎨 Personnalisation

### **Modifier les données de démo**
Éditez `web-app/src/data/mocks/mockData.ts` :
```typescript
// Ajouter vos propres données
export const mockTasks: Task[] = [
  {
    id: 1,
    label: 'Votre nouvelle tâche',
    iconUrl: '🎯',
    // ... autres propriétés
  }
]
```

### **Modifier l'authentification**
Dans `web-app/src/data/mocks/mockApiClient.ts` :
```typescript
// Changer les identifiants
if (payload.email === 'votre@email.com' && payload.password === 'motdepasse') {
  // ...
}
```

## 🔍 Monitoring

### **Vérifier le déploiement**
1. Onglet "Actions" sur GitHub
2. Vérifier que le workflow se termine avec succès
3. Temps de déploiement : ~3-5 minutes

### **Debugging**
- **Console navigateur** : Messages avec 🎭
- **Erreurs de build** : Onglet Actions GitHub
- **Données manquantes** : Vérifier localStorage

## 🔄 Mises à jour

### **Automatiques**
- Chaque push sur `main` ou `test-mockup`
- Déploiement automatique via GitHub Actions
- Pas d'intervention manuelle nécessaire

### **Manuelles**
Si besoin de rebuild :
```bash
cd web-app
npm run build
```

## 📊 Avantages de cette Configuration

### **Isolation**
- ✅ Branche de test séparée
- ✅ Pas d'impact sur main
- ✅ Déploiement indépendant

### **Flexibilité**
- ✅ Test de nouvelles fonctionnalités
- ✅ Expérimentation sans risque
- ✅ Validation avant merge

### **Simplicité**
- ✅ Même URL de démo
- ✅ Configuration automatique
- ✅ Pas de serveur à maintenir

## 🎉 Résultat

Vous avez maintenant :
- **2 branches** configurées pour GitHub Pages
- **Déploiement automatique** sur les deux branches
- **URL de démo** : https://drivoirefr.github.io/Together/
- **Données mockées** complètes et interactives
- **Interface responsive** pour mobile

## 💡 Tips

- **Gardez test-mockup** pour les expérimentations
- **Mergez vers main** quand vous êtes satisfait
- **Partagez l'URL** pour les tests utilisateurs
- **Utilisez les identifiants** : demo@example.com / demo123