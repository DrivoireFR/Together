import { initializeDatabase } from '../config/database';
import { MasterSeeder } from '../seeders/MasterSeeder';

async function runSeeders() {
  try {
    // Initialiser la base de données
    await initializeDatabase();

    // Exécuter tous les seeders
    await MasterSeeder.run();

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'exécution du seeder:', error);
    process.exit(1);
  }
}

runSeeders();