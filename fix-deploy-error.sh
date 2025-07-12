#!/bin/bash

echo "🔧 Correction de l'erreur de déploiement GitHub Actions..."

# Vérifier si on est sur la bonne branche
current_branch=$(git branch --show-current)
echo "📍 Branche actuelle: $current_branch"

if [ "$current_branch" != "test-mockup" ] && [ "$current_branch" != "main" ]; then
    echo "⚠️  Vous n'êtes pas sur une branche de déploiement (main ou test-mockup)"
    echo "🔄 Basculement vers test-mockup..."
    git checkout test-mockup 2>/dev/null || git checkout -b test-mockup
fi

# Ajouter les corrections
echo "📦 Ajout des corrections..."
git add .

# Commit des corrections
echo "💾 Commit de la correction..."
git commit -m "Fix GitHub Actions: Update to latest action versions

- Update actions/configure-pages v3 → v4
- Update actions/upload-pages-artifact v2 → v3  
- Update actions/deploy-pages v2 → v4
- Fix deprecated artifact actions error"

# Push des corrections
echo "🚀 Push des corrections..."
git push origin $current_branch

echo ""
echo "✅ Corrections appliquées et poussées !"
echo ""
echo "🎯 Le workflow GitHub Actions va maintenant se relancer automatiquement"
echo "📊 Suivez le progrès sur : https://github.com/DrivoireFR/Together/actions"
echo ""
echo "⏱️  Temps estimé : 3-5 minutes"
echo "🌐 URL de démo : https://drivoirefr.github.io/Together/"
echo ""
echo "🔐 Identifiants de test :"
echo "   Email: demo@example.com"
echo "   Mot de passe: demo123"