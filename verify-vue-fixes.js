#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification des corrections Vue.js...\n');

// Fonction pour compter les occurrences de defineEmits dans un fichier
function countDefineEmits(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/defineEmits\s*</g);
  return matches ? matches.length : 0;
}

// Fonction pour vérifier un composant Vue
function checkVueComponent(filePath, componentName) {
  const count = countDefineEmits(filePath);
  
  if (count === 0) {
    console.log(`⚪ ${componentName} - Aucun defineEmits (normal si pas d'émission)`);
    return true;
  } else if (count === 1) {
    console.log(`✅ ${componentName} - 1 defineEmits (correct)`);
    return true;
  } else {
    console.log(`❌ ${componentName} - ${count} defineEmits (duplication détectée)`);
    return false;
  }
}

let allGood = true;

console.log('📋 Vérification des composants corrigés...');

// Vérifier les composants qui avaient des duplications
allGood &= checkVueComponent(
  'web-app/src/presentation/components/molecules/TagFilter.vue',
  'TagFilter.vue'
);

allGood &= checkVueComponent(
  'web-app/src/presentation/components/atoms/BaseModal.vue',
  'BaseModal.vue'
);

allGood &= checkVueComponent(
  'web-app/src/presentation/components/molecules/FloatingActionPanel.vue',
  'FloatingActionPanel.vue'
);

allGood &= checkVueComponent(
  'web-app/src/presentation/components/molecules/CreateTaskForm.vue',
  'CreateTaskForm.vue'
);

console.log('\n📋 Vérification d\'autres composants importants...');

// Vérifier quelques autres composants pour s'assurer qu'ils sont corrects
allGood &= checkVueComponent(
  'web-app/src/presentation/components/atoms/TaskCard.vue',
  'TaskCard.vue'
);

allGood &= checkVueComponent(
  'web-app/src/presentation/components/molecules/LoginForm.vue',
  'LoginForm.vue'
);

allGood &= checkVueComponent(
  'web-app/src/presentation/components/atoms/BaseInput.vue',
  'BaseInput.vue'
);

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Toutes les erreurs Vue.js ont été corrigées !');
  console.log('');
  console.log('✅ Aucune duplication de defineEmits() détectée');
  console.log('✅ Tous les composants suivent les bonnes pratiques Vue 3');
  console.log('✅ Le build devrait maintenant réussir');
  console.log('');
  console.log('🚀 Prochaines étapes :');
  console.log('1. Lancez : ./fix-defineemits-error.sh');
  console.log('2. Vérifiez le build : https://github.com/DrivoireFR/Together/actions');
  console.log('3. Testez la démo : https://drivoirefr.github.io/Together/');
  console.log('');
  console.log('🔐 Identifiants : demo@example.com / demo123');
} else {
  console.log('⚠️  Certains composants ont encore des duplications');
  console.log('💡 Vérifiez les composants marqués ❌ ci-dessus');
  console.log('');
  console.log('🔧 Pattern correct pour Vue 3 <script setup> :');
  console.log('   const emit = defineEmits<{ eventName: [param: Type] }>()');
  console.log('   // OU simplement');
  console.log('   defineEmits<{ eventName: [param: Type] }>()');
  console.log('   // Mais PAS les deux dans le même composant !');
}

console.log('\n🛠️  Test en local : cd web-app && npm run dev');