#!/bin/bash

echo "🔍 Vérification de tous les imports..."

# Chercher les imports de demoAwareRepositories
echo "📋 Recherche d'imports de demoAwareRepositories..."
if grep -r "demoAwareRepositories" web-app/src/ --include="*.ts" --include="*.vue" --include="*.js"; then
  echo "❌ TROUVÉ: Des fichiers importent encore demoAwareRepositories"
  echo ""
  echo "🔧 Fichiers à corriger :"
  grep -r "demoAwareRepositories" web-app/src/ --include="*.ts" --include="*.vue" --include="*.js" -l
  echo ""
  echo "💡 Vous devez supprimer ces imports ou les remplacer par les repositories directs"
  exit 1
else
  echo "✅ Aucun import de demoAwareRepositories trouvé"
fi

# Chercher les imports de clientFactory
echo "📋 Recherche d'imports de clientFactory..."
if grep -r "clientFactory" web-app/src/ --include="*.ts" --include="*.vue" --include="*.js"; then
  echo "❌ TROUVÉ: Des fichiers importent encore clientFactory"
  echo ""
  echo "🔧 Fichiers à corriger :"
  grep -r "clientFactory" web-app/src/ --include="*.ts" --include="*.vue" --include="*.js" -l
  exit 1
else
  echo "✅ Aucun import de clientFactory trouvé"
fi

# Vérifier les duplications de defineEmits
echo "📋 Recherche de duplications defineEmits..."
duplicates=0

for file in $(find web-app/src -name "*.vue"); do
  count=$(grep -c "defineEmits\s*<" "$file" 2>/dev/null || echo 0)
  if [ "$count" -gt 1 ]; then
    echo "❌ DUPLICATION dans $file: $count occurrences de defineEmits"
    duplicates=$((duplicates + 1))
  fi
done

if [ $duplicates -gt 0 ]; then
  echo "❌ $duplicates fichiers avec des duplications defineEmits trouvés"
  exit 1
else
  echo "✅ Aucune duplication defineEmits trouvée"
fi

# Vérifier que les repositories utilisent IS_DEMO_MODE
echo "📋 Vérification de l'intégration IS_DEMO_MODE..."

repositories=("authRepository.ts" "groupRepository.ts" "taskRepository.ts")
missing=0

for repo in "${repositories[@]}"; do
  file="web-app/src/data/repositories/$repo"
  if [ -f "$file" ]; then
    if grep -q "IS_DEMO_MODE" "$file" && grep -q "mockApiClient" "$file"; then
      echo "✅ $repo correctement configuré"
    else
      echo "❌ $repo manque IS_DEMO_MODE ou mockApiClient"
      missing=$((missing + 1))
    fi
  else
    echo "❌ $repo n'existe pas"
    missing=$((missing + 1))
  fi
done

if [ $missing -gt 0 ]; then
  echo "❌ $missing repositories mal configurés"
  exit 1
fi

# Vérifier les fichiers de mocks
echo "📋 Vérification des mocks..."
if [ -f "web-app/src/data/mocks/mockData.ts" ] && [ -f "web-app/src/data/mocks/mockApiClient.ts" ]; then
  echo "✅ Fichiers de mocks présents"
else
  echo "❌ Fichiers de mocks manquants"
  exit 1
fi

echo ""
echo "🎉 ============================================="
echo "✅ TOUTES LES VÉRIFICATIONS PASSÉES !"
echo "============================================="
echo ""
echo "🚀 Vous pouvez maintenant lancer :"
echo "   ./clean-and-fix-all.sh"
echo ""
echo "Ou directement tester le build :"
echo "   cd web-app && npm run build"