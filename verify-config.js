#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration GitHub Pages...\n');

// Fonction pour vérifier un fichier
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    return false;
  }
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, searchText, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      return false;
    }
  } else {
    console.log(`❌ ${description} (fichier manquant)`);
    return false;
  }
}

let allGood = true;

// Vérifications des fichiers
console.log('📁 Vérification des fichiers...');
allGood &= checkFile('web-app/src/data/mocks/mockData.ts', 'Données mockées');
allGood &= checkFile('web-app/src/data/mocks/mockApiClient.ts', 'Client API mocké');
allGood &= checkFile('web-app/src/components/DemoBanner.vue', 'Banner de démo');
allGood &= checkFile('.github/workflows/deploy.yml', 'Workflow GitHub Actions');
allGood &= checkFile('web-app/public/.nojekyll', 'Fichier .nojekyll');

console.log('\n🔧 Vérification des configurations...');
allGood &= checkFileContent('web-app/vite.config.ts', '/Together/', 'Configuration Vite avec base URL');
allGood &= checkFileContent('web-app/src/shared/constants/index.ts', 'IS_DEMO_MODE', 'Détection du mode démo');
allGood &= checkFileContent('.github/workflows/deploy.yml', 'test-mockup', 'Branche test-mockup dans workflow');

console.log('\n📋 Vérification des scripts...');
allGood &= checkFile('setup-test-branch.sh', 'Script de création de branche');
allGood &= checkFile('GUIDE_BRANCHE_TEST.md', 'Guide de la branche de test');
allGood &= checkFile('DEMO_SETUP.md', 'Documentation complète');

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Configuration complète et correcte !');
  console.log('');
  console.log('🚀 Prochaines étapes :');
  console.log('1. Lancez : ./setup-test-branch.sh');
  console.log('2. Configurez GitHub Pages : https://github.com/DrivoireFR/Together/settings/pages');
  console.log('3. Testez sur : https://drivoirefr.github.io/Together/');
  console.log('');
  console.log('🔐 Identifiants : demo@example.com / demo123');
} else {
  console.log('⚠️  Certains éléments manquent ou sont incorrects');
  console.log('💡 Vérifiez les éléments marqués ❌ ci-dessus');
}

console.log('\n📱 Une fois déployé, testez sur votre téléphone !');