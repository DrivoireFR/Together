import { AppDataSource } from '../config/database';
import { TagsAndCongratsSeeder } from './TagsAndCongratsSeeder';
import { UserTestSeeder } from './UserTestSeeder';
import { GroupAndTasksSeeder } from './GroupAndTasksSeeder';

export class MasterSeeder {
    public static async run(): Promise<void> {
        try {
            console.log('🚀 Démarrage du seeding complet...');
            console.log('='.repeat(50));

            // Initialiser la connexion à la base de données
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                console.log('📊 Connexion à la base de données établie');
            }

            // 1. Créer les tags par défaut et leurs messages de félicitations
            console.log('\n📑 Étape 1: Création des tags et congrats par défaut');
            await TagsAndCongratsSeeder.run();

            // 2. Créer l'utilisateur de test
            console.log('\n👤 Étape 2: Création de l\'utilisateur de test');
            const testUser = await UserTestSeeder.run();

            // 3. Créer le groupe et les tâches de base
            console.log('\n🏠 Étape 3: Création du groupe et des tâches');
            await GroupAndTasksSeeder.run(testUser);

            console.log('\n='.repeat(50));
            console.log('🎉 Seeding complet terminé avec succès !');
            console.log('\n📝 Résumé:');
            console.log('   - Tags par défaut créés: Ménage, Animal de compagnie, Cuisine, Courses');
            console.log('   - Utilisateur de test: Jean Dupont (test@example.com)');
            console.log('   - Groupe: Maison Test');
            console.log('   - 8 tâches de base créées avec leurs tags associés');
            console.log('\n🔐 Connexion test: test@example.com / password123');

        } catch (error) {
            console.error('❌ Erreur lors du seeding:', error);
            throw error;
        }
    }
} 