import { initializeDatabase } from '../config/database';
import { TagsAndCongratsSeeder } from '../seeders/TagsAndCongratsSeeder';

async function runSeeders() {
  try {
    // Initialiser la base de données
    await initializeDatabase();
    
    // Exécuter le seeder
    await TagsAndCongratsSeeder.run();
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'exécution du seeder:', error);
    process.exit(1);
  }
}

runSeeders();