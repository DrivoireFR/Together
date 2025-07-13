# 🚀 Guide Rapide - Démo GitHub Pages

## 🎯 En 3 étapes simples

### 1. Nettoyage complet et corrections (NOUVEAU)
```bash
./clean-and-fix-all.sh
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

## � ERREURS TypeScript persistantes ?

Si vous avez encore des erreurs comme :
```
Error: src/data/repositories/demoAwareRepositories.ts(32,24): error TS2339: Property 'post' does not exist...
```

**SOLUTION** : Lancez le nettoyage complet
```bash
./clean-and-fix-all.sh
```

Cela supprime les fichiers problématiques et corrige tout automatiquement.

## � GitHub Actions "this Check has no steps" ?

Si GitHub Actions affiche ce message :
```
"this Check has no steps"
```

**SOLUTION** : Corrigez les workflows
```bash
./fix-github-actions-no-steps.sh
```

Puis configurez GitHub Pages source sur "GitHub Actions".

## �🛠️ Autres erreurs de build
```bash
# Corriger toutes les erreurs (TypeScript + Vue.js + GitHub Actions)
./fix-typescript-errors.sh

# Ou individuellement :
./fix-defineemits-error.sh    # Erreurs Vue.js
./fix-deploy-error.sh         # Erreurs GitHub Actions
```

## 🔍 Diagnostics
```bash
./check-imports.sh            # Vérifier les imports
```

## 🛠️ Personnalisation
Modifiez les données dans `web-app/src/data/mocks/mockData.ts`

---

💡 **Besoin d'aide ?** Consultez [DEMO_SETUP.md](DEMO_SETUP.md) pour les détails complets.