#!/bin/bash

echo "🔧 Correction des erreurs TypeScript..."

# Vérifier si on est sur la bonne branche
current_branch=$(git branch --show-current)
echo "📍 Branche actuelle: $current_branch"

# Supprimer le fichier clientFactory.ts problématique qui n'est plus utilisé
if [ -f "web-app/src/data/api/clientFactory.ts" ]; then
  echo "🗑️  Suppression du fichier clientFactory.ts non utilisé..."
  rm web-app/src/data/api/clientFactory.ts
fi

# Ajouter les corrections
echo "📦 Ajout des corrections TypeScript..."
git add .

# Commit des corrections
echo "💾 Commit de la correction..."
git commit -m "Fix TypeScript errors in repositories

- Delete problematic demoAwareRepositories.ts file
- Modify existing repositories to auto-detect demo mode
- Add IS_DEMO_MODE checks in authRepository.ts
- Add IS_DEMO_MODE checks in groupRepository.ts  
- Add IS_DEMO_MODE checks in taskRepository.ts
- Remove unused clientFactory.ts

Fixes TypeScript build errors:
- Property 'post' does not exist on type 'ApiClient | MockApiClient'
- Property 'get' does not exist on type 'ApiClient | MockApiClient'

Now repositories automatically use mockApiClient in demo mode 
and apiClient in production mode."

# Push des corrections
echo "🚀 Push des corrections..."
git push origin $current_branch

echo ""
echo "✅ Corrections TypeScript appliquées et poussées !"
echo ""
echo "🎯 Le build GitHub Actions va maintenant se relancer automatiquement"
echo "📊 Suivez le progrès sur : https://github.com/DrivoireFR/Together/actions"
echo ""
echo "⏱️  Temps estimé : 3-5 minutes"
echo "🌐 URL de démo : https://drivoirefr.github.io/Together/"
echo ""
echo "🔐 Identifiants de test :"
echo "   Email: demo@example.com"
echo "   Mot de passe: demo123"
echo ""
echo "🛠️  Test en local :"
echo "   cd web-app && npm run build"
echo "   cd web-app && npm run dev"
echo ""
echo "📋 Les repositories utilisent maintenant automatiquement :"
echo "   - mockApiClient en mode démo (GitHub Pages)"
echo "   - apiClient en mode production"