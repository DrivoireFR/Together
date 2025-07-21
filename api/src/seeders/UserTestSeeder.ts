import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export class UserTestSeeder {
    public static async run(): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);

        console.log('👤 Création de l\'utilisateur de test...');

        // Vérifier si l'utilisateur de test existe déjà
        let existingUser = await userRepository.findOne({
            where: { email: 'test@example.com' }
        });

        if (!existingUser) {
            // Créer l'utilisateur de test
            const user = userRepository.create({
                nom: 'Dupont',
                prenom: 'Jean',
                pseudo: 'jean.test',
                email: 'test@example.com',
                password: 'password123', // Sera hashé automatiquement par l'entité
                icone: '👨‍💼'
            });

            existingUser = await userRepository.save(user);
            console.log(`✅ Utilisateur de test créé: ${user.prenom} ${user.nom} (${user.email})`);
        } else {
            console.log(`ℹ️  Utilisateur de test existant: ${existingUser.prenom} ${existingUser.nom} (${existingUser.email})`);
        }

        return existingUser;
    }
} 