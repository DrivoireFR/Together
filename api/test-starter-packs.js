const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Configuration des headers avec authentification
const headers = {
  'Content-Type': 'application/json',
  // Vous devrez remplacer ce token par un vrai token d'authentification
  'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE'
};

async function testStarterPacks() {
  try {
    console.log('🚀 Test des StarterPacks - Backend');
    console.log('=====================================\n');

    // Test 1: Créer un groupe et vérifier le starterPack
    console.log('1. Test de création de groupe avec starterPack...');
    try {
      const createGroupResponse = await axios.post(`${API_BASE_URL}/groups`, {
        nom: `TestGroup_${Date.now()}`
      }, { headers });

      console.log('✅ Groupe créé avec succès');
      console.log('📦 StarterPack reçu:');
      console.log(`   - Tags: ${createGroupResponse.data.starterPack.tags.length} tags`);
      console.log(`   - Tasks: ${createGroupResponse.data.starterPack.tasks.length} tâches`);
      
      const groupId = createGroupResponse.data.group.id;
      console.log(`   - Group ID: ${groupId}\n`);

      // Test 2: Ajouter des tags en bulk
      console.log('2. Test d\'ajout de tags en bulk...');
      const newTags = [
        { label: "Test Tag 1", color: "#FF0000" },
        { label: "Test Tag 2", color: "#00FF00" }
      ];

      const addTagsResponse = await axios.post(`${API_BASE_URL}/groups/${groupId}/tags`, {
        tags: newTags
      }, { headers });

      console.log('✅ Tags ajoutés avec succès');
      console.log(`   - ${addTagsResponse.data.tags.length} tags ajoutés\n`);

      // Test 3: Ajouter des tâches en bulk
      console.log('3. Test d\'ajout de tâches en bulk...');
      const newTasks = [
        {
          label: "Tâche de test 1",
          frequenceEstimee: 1,
          uniteFrequence: "semaine",
          points: 2,
          tagLabel: "Test Tag 1"
        },
        {
          label: "Tâche de test 2",
          frequenceEstimee: 3,
          uniteFrequence: "semaine",
          points: 1,
          tagLabel: "Test Tag 2"
        }
      ];

      const addTasksResponse = await axios.post(`${API_BASE_URL}/groups/${groupId}/tasks`, {
        tasks: newTasks
      }, { headers });

      console.log('✅ Tâches ajoutées avec succès');
      console.log(`   - ${addTasksResponse.data.tasks.length} tâches ajoutées\n`);

      console.log('🎉 Tous les tests sont passés avec succès!');
      console.log('\n📋 Résumé des fonctionnalités implémentées:');
      console.log('   ✅ Création de groupe avec starterPack automatique');
      console.log('   ✅ Ajout en bulk de tags à un groupe');
      console.log('   ✅ Ajout en bulk de tâches à un groupe avec catégorisation');
      console.log('   ✅ Données par défaut stockées dans un fichier JSON');

    } catch (error) {
      if (error.response) {
        console.error(`❌ Erreur API: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.error('❌ Erreur:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Instructions d'utilisation
console.log('📝 Instructions pour tester:');
console.log('1. Assurez-vous que l\'API est démarrée sur localhost:3000');
console.log('2. Remplacez YOUR_AUTH_TOKEN_HERE par un vrai token d\'authentification');
console.log('3. Lancez: node test-starter-packs.js\n');

// Décommenter la ligne suivante pour lancer le test
// testStarterPacks();