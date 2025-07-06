// Script de test pour les tags liés aux groupes
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Variables pour stocker les données de test
let authToken = '';
let userId = null;
let groupId = null;
let tagId = null;
let taskId = null;

async function testTagsGroups() {
  console.log('🧪 Test des Tags liés aux Groupes\n');

  try {
    // 1. Test de la route de santé
    console.log('1. Test de la route de santé...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ API opérationnelle:', healthResponse.data.message);

    // 2. Inscription d'un utilisateur de test
    console.log('\n2. Inscription d\'un utilisateur de test...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      nom: 'Test',
      prenom: 'User',
      pseudo: 'testuser_tags',
      email: 'test.tags@example.com',
      password: 'password123'
    });
    
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id;
    console.log('✅ Utilisateur créé avec ID:', userId);

    // 3. Création d'un groupe
    console.log('\n3. Création d\'un groupe...');
    const groupResponse = await axios.post(`${BASE_URL}/groups`, {
      nom: 'Groupe Test Tags'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    groupId = groupResponse.data.group.id;
    console.log('✅ Groupe créé avec ID:', groupId);

    // 4. Rejoindre le groupe créé
    console.log('\n4. Rejoindre le groupe...');
    await axios.post(`${BASE_URL}/groups/${groupId}/join`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Groupe rejoint avec succès');

    // 5. Création d'un tag dans le groupe
    console.log('\n5. Création d\'un tag dans le groupe...');
    const tagResponse = await axios.post(`${BASE_URL}/tags`, {
      label: 'Urgent',
      color: '#FF0000',
      groupId: groupId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    tagId = tagResponse.data.tag.id;
    console.log('✅ Tag créé avec ID:', tagId);

    // 6. Récupération des tags du groupe
    console.log('\n6. Récupération des tags du groupe...');
    const groupTagsResponse = await axios.get(`${BASE_URL}/tags/group/${groupId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Tags du groupe récupérés:', groupTagsResponse.data.tags.length, 'tag(s)');

    // 7. Création d'une tâche avec le tag
    console.log('\n7. Création d\'une tâche avec le tag...');
    const taskResponse = await axios.post(`${BASE_URL}/tasks`, {
      label: 'Tâche de test',
      frequenceEstimee: 1,
      uniteFrequence: 'semaine',
      groupId: groupId,
      tagId: tagId
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    taskId = taskResponse.data.task.id;
    console.log('✅ Tâche créée avec ID:', taskId);

    // 8. Récupération du groupe avec ses tags
    console.log('\n8. Récupération du groupe avec ses tags...');
    const groupDetailsResponse = await axios.get(`${BASE_URL}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Groupe récupéré avec', groupDetailsResponse.data.group.tags.length, 'tag(s)');

    // 9. Test d'erreur : tentative de création d'un tag sans être membre
    console.log('\n9. Test d\'erreur : création d\'un second utilisateur...');
    const user2Response = await axios.post(`${BASE_URL}/auth/register`, {
      nom: 'Test2',
      prenom: 'User2',
      pseudo: 'testuser2_tags',
      email: 'test2.tags@example.com',
      password: 'password123'
    });
    
    const user2Token = user2Response.data.token;
    
    try {
      await axios.post(`${BASE_URL}/tags`, {
        label: 'Tag non autorisé',
        color: '#00FF00',
        groupId: groupId
      }, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('❌ L\'erreur attendue n\'a pas été levée');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Erreur 403 correctement levée pour utilisateur non membre');
      } else {
        console.log('❌ Erreur inattendue:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('Détails:', error.response.data.errors);
    }
  }
}

// Exécuter les tests
testTagsGroups().catch(console.error);