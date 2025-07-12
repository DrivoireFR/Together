#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configuration automatique de GitHub Pages pour la démo...\n');

// Fonction pour obtenir le nom du repository depuis la remote origin
function getRepoName() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/);
    if (match) {
      return match[2];
    }
  } catch (error) {
    console.log('⚠️  Impossible de détecter automatiquement le nom du repository');
  }
  return null;
}

// Fonction pour modifier le vite.config.ts
function updateViteConfig(repoName) {
  const configPath = path.join(__dirname, 'web-app', 'vite.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ Fichier vite.config.ts non trouvé');
    return false;
  }

  let content = fs.readFileSync(configPath, 'utf8');
  
  // Remplacer la ligne base
  const baseRegex = /base:\s*['"`][^'"`]*['"`]/;
  const newBase = `base: '/${repoName}/'`;
  
  if (baseRegex.test(content)) {
    content = content.replace(baseRegex, newBase);
  } else {
    // Ajouter la ligne base si elle n'existe pas
    content = content.replace(
      /export default defineConfig\(\{/,
      `export default defineConfig({\n  ${newBase},`
    );
  }
  
  fs.writeFileSync(configPath, content, 'utf8');
  console.log(`✅ Configuration Vite mise à jour avec base: '/${repoName}/'`);
  return true;
}

// Fonction pour créer le fichier .nojekyll
function createNojekyll() {
  const nojekyllPath = path.join(__dirname, 'web-app', 'public', '.nojekyll');
  const publicDir = path.dirname(nojekyllPath);
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ Fichier .nojekyll créé pour GitHub Pages');
}

// Fonction pour vérifier la configuration GitHub Actions
function checkGithubActions() {
  const workflowPath = path.join(__dirname, '.github', 'workflows', 'deploy.yml');
  if (fs.existsSync(workflowPath)) {
    console.log('✅ Workflow GitHub Actions déjà configuré');
    return true;
  }
  console.log('⚠️  Workflow GitHub Actions manquant (deploy.yml)');
  return false;
}

// Fonction pour afficher les instructions de configuration
function showInstructions(repoName) {
  console.log('\n🎯 Configuration terminée ! Étapes suivantes:\n');
  console.log('1. 📤 Poussez vos modifications sur GitHub:');
  console.log('   git add .');
  console.log('   git commit -m "Configure GitHub Pages demo"');
  console.log('   git push origin main\n');
  
  console.log('2. 🔧 Configurez GitHub Pages:');
  console.log('   - Allez sur https://github.com/VOTRE-USERNAME/' + repoName + '/settings/pages');
  console.log('   - Sélectionnez "GitHub Actions" comme source');
  console.log('   - Sauvegardez\n');
  
  console.log('3. 🌐 Votre démo sera disponible sur:');
  console.log('   https://VOTRE-USERNAME.github.io/' + repoName + '/\n');
  
  console.log('4. 🔐 Identifiants de connexion pour la démo:');
  console.log('   Email: demo@example.com');
  console.log('   Mot de passe: demo123\n');
  
  console.log('5. 📱 Testez sur votre téléphone en ouvrant l\'URL ci-dessus\n');
  
  console.log('💡 Conseil: Consultez DEMO_SETUP.md pour plus de détails');
}

// Fonction principale
function main() {
  const repoName = getRepoName();
  
  if (!repoName) {
    console.log('❌ Impossible de détecter le nom du repository');
    console.log('💡 Assurez-vous d\'être dans un repository Git avec une remote origin GitHub');
    process.exit(1);
  }
  
  console.log(`📦 Repository détecté: ${repoName}\n`);
  
  // Mettre à jour la configuration Vite
  if (!updateViteConfig(repoName)) {
    console.log('❌ Échec de la mise à jour de vite.config.ts');
    process.exit(1);
  }
  
  // Créer le fichier .nojekyll
  createNojekyll();
  
  // Vérifier le workflow GitHub Actions
  checkGithubActions();
  
  // Afficher les instructions
  showInstructions(repoName);
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { updateViteConfig, createNojekyll, getRepoName };