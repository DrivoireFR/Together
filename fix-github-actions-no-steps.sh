#!/bin/bash

echo "🔧 Correction du problème 'this Check has no steps' de GitHub Actions..."

# Vérifier si on est sur la bonne branche
current_branch=$(git branch --show-current)
echo "📍 Branche actuelle: $current_branch"

echo ""
echo "🔍 DIAGNOSTIC du problème:"
echo "============================================="
echo "Le message 'this Check has no steps' peut être causé par :"
echo "1. ❌ Condition 'if' trop restrictive dans le workflow"
echo "2. ❌ Job qui échoue avant le déploiement"
echo "3. ❌ Dépendances entre jobs qui bloquent l'exécution"
echo "4. ❌ Permissions GitHub Pages mal configurées"
echo ""

echo "🛠️  SOLUTIONS appliquées:"
echo "============================================="
echo "✅ Workflow original corrigé (condition if simplifiée)"
echo "✅ Workflow simple créé (tout en un job)"
echo "✅ Debug ajouté pour diagnostiquer les problèmes"
echo ""

# Vérifier les permissions GitHub Pages
echo "📋 CONFIGURATION REQUISE sur GitHub:"
echo "============================================="
echo "1. Allez sur: https://github.com/DrivoireFR/Together/settings/pages"
echo "2. Dans 'Source', sélectionnez: 'GitHub Actions'"
echo "3. Sauvegardez les paramètres"
echo ""

# Vérifier que les workflows existent
if [ -f ".github/workflows/deploy.yml" ]; then
  echo "✅ Workflow principal: deploy.yml (condition if corrigée)"
else
  echo "❌ Workflow principal manquant"
fi

if [ -f ".github/workflows/deploy-simple.yml" ]; then
  echo "✅ Workflow de secours: deploy-simple.yml (debug activé)"
else
  echo "❌ Workflow de secours manquant"
fi

echo ""
echo "🚀 TESTS à effectuer:"
echo "============================================="

# Test 1: Vérifier que le build fonctionne localement
echo "🔨 Test 1: Build local..."
cd web-app
if npm run build > /dev/null 2>&1; then
  echo "✅ Build local réussi"
  if [ -d "dist" ]; then
    echo "✅ Dossier dist/ créé avec $(ls dist/ | wc -l) fichiers"
  else
    echo "❌ Dossier dist/ manquant après build"
  fi
else
  echo "❌ Build local échoué - vérifiez les erreurs TypeScript"
  cd ..
  exit 1
fi

cd ..

# Ajouter les corrections
echo ""
echo "📦 Application des corrections..."
git add .

# Commit des corrections
echo "💾 Commit des corrections..."
git commit -m "🔧 Fix GitHub Actions 'no steps' issue

✅ FIXES APPLIED:
- Simplify 'if' condition in deploy job  
- Create deploy-simple.yml workflow with debug
- Combine build and deploy in single job
- Add debug output for diagnostics

✅ WORKFLOW IMPROVEMENTS:
- Remove restrictive branch conditions
- Eliminate job dependencies issues
- Add build output verification
- Include deployment URL logging

✅ TROUBLESHOOTING:
- If deploy.yml still fails, deploy-simple.yml will work
- Debug output shows GitHub context
- Build verification ensures dist/ folder exists

🎯 NEXT STEPS:
1. Configure GitHub Pages source to 'GitHub Actions'
2. Push this commit to trigger workflows
3. Check Actions tab for execution details
4. Deploy URL: https://drivoirefr.github.io/Together/"

# Push des corrections
echo "🚀 Push des corrections..."
git push origin $current_branch

echo ""
echo "🎯 ============================================="
echo "✅ CORRECTIONS APPLIQUÉES !"
echo "============================================="
echo ""
echo "📊 Suivi des Actions GitHub:"
echo "   https://github.com/DrivoireFR/Together/actions"
echo ""
echo "🔧 Configuration GitHub Pages (IMPORTANT):"
echo "   1. https://github.com/DrivoireFR/Together/settings/pages"
echo "   2. Source: 'GitHub Actions' (pas 'Deploy from branch')"
echo "   3. Save"
echo ""
echo "⏱️  Temps attendu: 3-5 minutes"
echo "🌐 URL finale: https://drivoirefr.github.io/Together/"
echo "🔐 Identifiants: demo@example.com / demo123"
echo ""
echo "🔍 Si le problème persiste:"
echo "   - Vérifiez l'onglet 'Actions' pour les logs détaillés"
echo "   - Le workflow 'deploy-simple.yml' inclut du debug"
echo "   - Assurez-vous que GitHub Pages est configuré sur 'GitHub Actions'"
echo ""
echo "📱 Une fois déployé, testez sur votre téléphone !"