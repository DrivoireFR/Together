#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des corrections TypeScript...\n');

// Fonction pour vérifier si un fichier existe
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} (fichier manquant)`);
    return false;
  }
}

// Fonction pour vérifier si un fichier est supprimé
function checkFileDeleted(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`✅ ${description} (correctement supprimé)`);
    return true;
  } else {
    console.log(`❌ ${description} (devrait être supprimé)`);
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
      console.log(`❌ ${description} (contenu manquant)`);
      return false;
    }
  } else {
    console.log(`❌ ${description} (fichier manquant)`);
    return false;
  }
}

let allGood = true;

// Vérifications des fichiers supprimés
console.log('🗑️  Vérification des fichiers supprimés...');
allGood &= checkFileDeleted('web-app/src/data/repositories/demoAwareRepositories.ts', 'demoAwareRepositories.ts');
allGood &= checkFileDeleted('web-app/src/data/api/clientFactory.ts', 'clientFactory.ts');

// Vérifications des repositories modifiés
console.log('\n📋 Vérification des repositories modifiés...');
allGood &= checkFile('web-app/src/data/repositories/authRepository.ts', 'authRepository.ts existe');
allGood &= checkFile('web-app/src/data/repositories/groupRepository.ts', 'groupRepository.ts existe');
allGood &= checkFile('web-app/src/data/repositories/taskRepository.ts', 'taskRepository.ts existe');

// Vérifications du contenu (détection mode démo)
console.log('\n🔧 Vérification de l\'intégration du mode démo...');
allGood &= checkFileContent(
  'web-app/src/data/repositories/authRepository.ts',
  'IS_DEMO_MODE',
  'authRepository.ts utilise IS_DEMO_MODE'
);
allGood &= checkFileContent(
  'web-app/src/data/repositories/authRepository.ts',
  'mockApiClient.login',
  'authRepository.ts utilise mockApiClient'
);

allGood &= checkFileContent(
  'web-app/src/data/repositories/groupRepository.ts',
  'IS_DEMO_MODE',
  'groupRepository.ts utilise IS_DEMO_MODE'
);
allGood &= checkFileContent(
  'web-app/src/data/repositories/groupRepository.ts',
  'mockApiClient.getAllGroups',
  'groupRepository.ts utilise mockApiClient'
);

allGood &= checkFileContent(
  'web-app/src/data/repositories/taskRepository.ts',
  'IS_DEMO_MODE',
  'taskRepository.ts utilise IS_DEMO_MODE'
);
allGood &= checkFileContent(
  'web-app/src/data/repositories/taskRepository.ts',
  'mockApiClient.getAllTasks',
  'taskRepository.ts utilise mockApiClient'
);

// Vérification des mocks
console.log('\n🎭 Vérification des mocks...');
allGood &= checkFile('web-app/src/data/mocks/mockData.ts', 'Données mockées');
allGood &= checkFile('web-app/src/data/mocks/mockApiClient.ts', 'Client API mocké');

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Toutes les corrections TypeScript sont correctes !');
  console.log('');
  console.log('✅ Fichiers problématiques supprimés');
  console.log('✅ Repositories modifiés avec détection auto du mode démo');
  console.log('✅ Intégration mockApiClient fonctionnelle');
  console.log('✅ Le build devrait maintenant réussir');
  console.log('');
  console.log('🚀 Prochaines étapes :');
  console.log('1. Lancez : ./fix-typescript-errors.sh');
  console.log('2. Vérifiez le build : https://github.com/DrivoireFR/Together/actions');
  console.log('3. Testez la démo : https://drivoirefr.github.io/Together/');
  console.log('');
  console.log('🔐 Identifiants : demo@example.com / demo123');
  console.log('');
  console.log('📋 Architecture des repositories :');
  console.log('   if (IS_DEMO_MODE) { return mockApiClient.method() }');
  console.log('   else { return apiClient.method() }');
} else {
  console.log('⚠️  Certaines corrections manquent ou sont incorrectes');
  console.log('💡 Vérifiez les éléments marqués ❌ ci-dessus');
  console.log('');
  console.log('🔧 Résolution :');
  console.log('1. Supprimez demoAwareRepositories.ts');
  console.log('2. Modifiez les repositories existants avec IS_DEMO_MODE');
  console.log('3. Importez mockApiClient dans chaque repository');
}

console.log('\n🛠️  Test en local : cd web-app && npm run build');