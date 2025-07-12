#!/bin/bash

echo "🔧 Correction des erreurs defineEmits() dupliqués..."

# Vérifier si on est sur la bonne branche
current_branch=$(git branch --show-current)
echo "📍 Branche actuelle: $current_branch"

# Ajouter les corrections
echo "📦 Ajout des corrections Vue.js..."
git add .

# Commit des corrections
echo "💾 Commit de la correction..."
git commit -m "Fix Vue.js defineEmits duplications

- Remove duplicate defineEmits() calls in TagFilter.vue
- Remove duplicate defineEmits() calls in BaseModal.vue  
- Remove duplicate defineEmits() calls in FloatingActionPanel.vue
- Remove duplicate defineEmits() calls in CreateTaskForm.vue
- Keep only the const emit = defineEmits() pattern

Fixes: [vite:vue] [@vue/compiler-sfc] duplicate defineEmits() call"

# Push des corrections
echo "🚀 Push des corrections..."
git push origin $current_branch

echo ""
echo "✅ Corrections Vue.js appliquées et poussées !"
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
echo "   cd web-app && npm run dev"