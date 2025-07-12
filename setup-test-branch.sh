#!/bin/bash

echo "🚀 Configuration de la branche de test pour GitHub Pages..."

# Créer et basculer vers la branche test-mockup
echo "📝 Création de la branche test-mockup..."
git checkout -b test-mockup

# Ajouter tous les fichiers modifiés
echo "📦 Ajout des fichiers..."
git add .

# Commit des changements
echo "💾 Commit des changements..."
git commit -m "Configure GitHub Pages demo with mockup data

- Add mock data and API client
- Configure Vite for GitHub Pages deployment
- Add GitHub Actions workflow for auto-deploy
- Add demo banner component
- Support for test-mockup branch deployment"

# Pousser la branche
echo "🚀 Push de la branche test-mockup..."
git push -u origin test-mockup

echo ""
echo "✅ Branche test-mockup créée et poussée !"
echo ""
echo "🎯 Prochaines étapes :"
echo "1. Allez sur https://github.com/DrivoireFR/Together/settings/pages"
echo "2. Sélectionnez 'GitHub Actions' comme source"
echo "3. Votre démo sera disponible sur : https://drivoirefr.github.io/Together/"
echo ""
echo "🔐 Identifiants de connexion :"
echo "   Email: demo@example.com"
echo "   Mot de passe: demo123"
echo ""
echo "📱 Testez sur votre téléphone en ouvrant l'URL ci-dessus !"
echo ""
echo "🔄 Pour revenir à main : git checkout main"
echo "🔄 Pour revenir à test-mockup : git checkout test-mockup"