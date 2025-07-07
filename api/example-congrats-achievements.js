const axios = require('axios');

// Configuration de base
const API_BASE_URL = 'http://localhost:3000/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fonctions utilitaires
async function makeRequest(method, url, data = null) {
  try {
    const response = await axiosInstance({
      method,
      url,
      data
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur ${method} ${url}:`, error.response?.data || error.message);
    throw error;
  }
}

// Exemples d'utilisation des Congrats
async function exemplesCongrats() {
  console.log('\n🎉 === EXEMPLES CONGRATS ===');

  // 1. Récupérer tous les congrats
  console.log('\n📋 Récupération de tous les congrats:');
  const allCongrats = await makeRequest('GET', '/congrats');
  console.log(`Nombre de congrats: ${allCongrats.length}`);
  allCongrats.forEach(congrats => {
    console.log(`- ${congrats.tag.label} (Niveau ${congrats.level}): ${congrats.message}`);
  });

  // 2. Récupérer les congrats d'un tag spécifique (par exemple, Ménage)
  if (allCongrats.length > 0) {
    const firstTag = allCongrats[0].tag;
    console.log(`\n🏷️ Congrats pour le tag "${firstTag.label}":`);
    const tagCongrats = await makeRequest('GET', `/congrats/tag/${firstTag.id}`);
    tagCongrats.forEach(congrats => {
      console.log(`- Niveau ${congrats.level}: ${congrats.message}`);
    });
  }

  // 3. Créer un nouveau congrats personnalisé (exemple)
  try {
    console.log('\n➕ Création d\'un congrats personnalisé:');
    const newCongrats = await makeRequest('POST', '/congrats', {
      level: 1,
      message: "Bravo ! Vous avez commencé quelque chose de nouveau ! 🌟",
      tagId: allCongrats[0]?.tag.id // Utilise le premier tag disponible
    });
    console.log('Congrats créé:', newCongrats.message);
  } catch (error) {
    console.log('Note: Création de congrats échouée (peut-être déjà existant)');
  }
}

// Exemples d'utilisation des Achievements
async function exemplesAchievements() {
  console.log('\n🏆 === EXEMPLES ACHIEVEMENTS ===');

  // 1. Récupérer tous les achievements
  console.log('\n📋 Récupération de tous les achievements:');
  const allAchievements = await makeRequest('GET', '/achievements');
  console.log(`Nombre total d'achievements: ${allAchievements.length}`);

  // 2. Récupérer les achievements d'un utilisateur spécifique
  const userId = 1; // Supposons que l'utilisateur 1 existe
  try {
    console.log(`\n👤 Achievements de l'utilisateur ${userId}:`);
    const userAchievements = await makeRequest('GET', `/achievements/user/${userId}`);
    console.log(`Nombre d'achievements: ${userAchievements.length}`);
    userAchievements.forEach(achievement => {
      console.log(`- ${achievement.congrats.tag.label} (Niveau ${achievement.congrats.level}): ${achievement.congrats.message}`);
      console.log(`  Obtenu le: ${new Date(achievement.achievedAt).toLocaleDateString()}`);
    });
  } catch (error) {
    console.log(`Note: Utilisateur ${userId} n'a pas encore d'achievements ou n'existe pas`);
  }

  // 3. Statistiques d'un utilisateur
  try {
    console.log(`\n📊 Statistiques de l'utilisateur ${userId}:`);
    const stats = await makeRequest('GET', `/achievements/user/${userId}/stats`);
    console.log(`Total achievements: ${stats.totalAchievements}`);
    console.log('Répartition par catégorie:');
    Object.entries(stats.statsByTag).forEach(([tag, counts]) => {
      console.log(`- ${tag}: ${counts.total} total (${counts.level1} niveau 1, ${counts.level2} niveau 2)`);
    });
  } catch (error) {
    console.log(`Note: Pas de statistiques pour l'utilisateur ${userId}`);
  }

  // 4. Attribuer un achievement à un utilisateur
  try {
    console.log('\n🎯 Attribution d\'un nouvel achievement:');
    const congrats = await makeRequest('GET', '/congrats');
    if (congrats.length > 0) {
      const achievement = await makeRequest('POST', '/achievements', {
        userId: userId,
        groupId: 1, // Supposons que le groupe 1 existe
        congratsId: congrats[0].id,
        achievedAt: new Date().toISOString()
      });
      console.log('Achievement attribué:', {
        user: achievement.user.nom + ' ' + achievement.user.prenom,
        group: achievement.group.nom,
        message: achievement.congrats.message,
        category: achievement.congrats.tag.label,
        level: achievement.congrats.level
      });
    }
  } catch (error) {
    console.log('Note: Attribution d\'achievement échouée (peut-être déjà attribué ou groupe inexistant)');
  }
}

// Exemple de workflow complet
async function exempleWorkflowComplet() {
  console.log('\n🔄 === WORKFLOW COMPLET ===');
  
  console.log('\n1. Un utilisateur termine une tâche de ménage...');
  console.log('2. Le système détermine le niveau de progression...');
  console.log('3. Un achievement est attribué avec le bon congrats...');
  
  try {
    // Récupérer un congrats de ménage niveau 1
    const allCongrats = await makeRequest('GET', '/congrats');
    const menageCongrats = allCongrats.find(c => 
      c.tag.label === 'Ménage' && c.level === 1
    );
    
    if (menageCongrats) {
      console.log(`4. Message de félicitation: "${menageCongrats.message}"`);
      
      // Simuler l'attribution de l'achievement
      const userId = 1;
      const groupId = 1; // Dans le contexte d'un groupe spécifique
      try {
        const achievement = await makeRequest('POST', '/achievements', {
          userId: userId,
          groupId: groupId,
          congratsId: menageCongrats.id
        });
        console.log('5. Achievement enregistré avec succès ! 🎉');
        console.log(`   Attribué dans le groupe: ${achievement.group.nom}`);
      } catch (error) {
        console.log('5. Achievement déjà attribué précédemment pour ce groupe');
      }
    }
  } catch (error) {
    console.log('Workflow non exécutable - données manquantes');
  }
}

// Fonction principale
async function main() {
  console.log('🚀 === DÉMONSTRATION SYSTÈME CONGRATS & ACHIEVEMENTS ===');
  console.log('Note: Assurez-vous que le serveur API est démarré et que le seeder a été exécuté');
  
  try {
    await exemplesCongrats();
    await exemplesAchievements();
    await exempleWorkflowComplet();
    
    console.log('\n✅ === DÉMONSTRATION TERMINÉE ===');
    console.log('Pour plus d\'informations, consultez CONGRATS_ACHIEVEMENTS_DOCUMENTATION.md');
    
  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    console.log('\nVérifiez que:');
    console.log('1. Le serveur API est démarré (npm run dev)');
    console.log('2. Le seeder a été exécuté (npm run seed)');
    console.log('3. Au moins un utilisateur existe dans la base');
  }
}

// Exécution si le script est appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  exemplesCongrats,
  exemplesAchievements,
  exempleWorkflowComplet
};