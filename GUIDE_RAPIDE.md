# 🚀 Guide Rapide - Démo GitHub Pages

## 🎯 En 3 étapes simples

### 1. Lancez le script de branche de test
```bash
./setup-test-branch.sh
```

### 2. Configurez GitHub Pages
1. Allez sur **https://github.com/DrivoireFR/Together/settings/pages**
2. Sélectionnez **"GitHub Actions"** comme source
3. Attendez quelques minutes ⏱️

### 3. C'est terminé !

Votre application sera disponible sur :
**`https://drivoirefr.github.io/Together/`**

## 🔐 Connexion démo
- **Email** : `demo@example.com`
- **Mot de passe** : `demo123`

## 📱 Test sur mobile
Ouvrez simplement l'URL sur votre téléphone !

## 🔄 Mises à jour
Chaque push sur `main` ou `test-mockup` met à jour automatiquement votre démo.

## 🛠️ En cas d'erreur de build
```bash
# Corriger toutes les erreurs (TypeScript + Vue.js + GitHub Actions)
./fix-typescript-errors.sh

# Ou individuellement :
./fix-defineemits-error.sh    # Erreurs Vue.js
./fix-deploy-error.sh         # Erreurs GitHub Actions
```

## 🛠️ Personnalisation
Modifiez les données dans `web-app/src/data/mocks/mockData.ts`

---

💡 **Besoin d'aide ?** Consultez [DEMO_SETUP.md](DEMO_SETUP.md) pour les détails complets.