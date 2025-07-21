import { AppDataSource } from '../config/database';
import { Group } from '../entities/Group';
import { Task, FrequencyUnit } from '../entities/Task';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

interface TaskData {
    label: string;
    iconUrl?: string;
    frequenceEstimee: number;
    uniteFrequence: FrequencyUnit;
    points: number;
    tagLabel: string;
}

const defaultTasksData: TaskData[] = [
    {
        label: 'Passer l\'aspirateur',
        iconUrl: '🧹',
        frequenceEstimee: 2,
        uniteFrequence: FrequencyUnit.SEMAINE,
        points: 10,
        tagLabel: 'Ménage'
    },
    {
        label: 'Faire la vaisselle',
        iconUrl: '🍽️',
        frequenceEstimee: 1,
        uniteFrequence: FrequencyUnit.JOUR,
        points: 5,
        tagLabel: 'Ménage'
    },
    {
        label: 'Nettoyer la salle de bain',
        iconUrl: '🛁',
        frequenceEstimee: 1,
        uniteFrequence: FrequencyUnit.SEMAINE,
        points: 15,
        tagLabel: 'Ménage'
    },
    {
        label: 'Nourrir le chat',
        iconUrl: '🐱',
        frequenceEstimee: 2,
        uniteFrequence: FrequencyUnit.JOUR,
        points: 3,
        tagLabel: 'Animal de compagnie'
    },
    {
        label: 'Sortir le chien',
        iconUrl: '🐕',
        frequenceEstimee: 3,
        uniteFrequence: FrequencyUnit.JOUR,
        points: 5,
        tagLabel: 'Animal de compagnie'
    },
    {
        label: 'Préparer le dîner',
        iconUrl: '🍳',
        frequenceEstimee: 1,
        uniteFrequence: FrequencyUnit.JOUR,
        points: 8,
        tagLabel: 'Cuisine'
    },
    {
        label: 'Faire les courses',
        iconUrl: '🛒',
        frequenceEstimee: 2,
        uniteFrequence: FrequencyUnit.SEMAINE,
        points: 12,
        tagLabel: 'Courses'
    },
    {
        label: 'Faire le ménage des placards',
        iconUrl: '📦',
        frequenceEstimee: 1,
        uniteFrequence: FrequencyUnit.MOIS,
        points: 20,
        tagLabel: 'Ménage'
    }
];

export class GroupAndTasksSeeder {
    public static async run(testUser: User): Promise<void> {
        const groupRepository = AppDataSource.getRepository(Group);
        const taskRepository = AppDataSource.getRepository(Task);
        const tagRepository = AppDataSource.getRepository(Tag);

        console.log('🏠 Création du groupe de test et des tâches...');

        // Vérifier si le groupe existe déjà
        let existingGroup = await groupRepository.findOne({
            where: { nom: 'Maison Test' },
            relations: ['users']
        });

        if (!existingGroup) {
            // Créer le groupe de test
            const group = groupRepository.create({
                nom: 'Maison Test',
                users: [testUser]
            });
            existingGroup = await groupRepository.save(group);
            console.log(`✅ Groupe créé: ${group.nom}`);
        } else {
            // Vérifier si l'utilisateur est déjà dans le groupe
            const userInGroup = existingGroup.users.some(user => user.id === testUser.id);
            if (!userInGroup) {
                existingGroup.users.push(testUser);
                await groupRepository.save(existingGroup);
                console.log(`✅ Utilisateur ajouté au groupe existant: ${existingGroup.nom}`);
            } else {
                console.log(`ℹ️  Groupe existant: ${existingGroup.nom}`);
            }
        }

        // Créer les tâches
        for (const taskData of defaultTasksData) {
            // Vérifier si la tâche existe déjà
            const existingTask = await taskRepository.findOne({
                where: { label: taskData.label, group: { id: existingGroup.id } }
            });

            if (!existingTask) {
                // Trouver le tag correspondant
                const tag = await tagRepository.findOne({
                    where: { label: taskData.tagLabel, isDefault: true }
                });

                if (!tag) {
                    console.log(`⚠️  Tag non trouvé: ${taskData.tagLabel}, tâche "${taskData.label}" créée sans tag`);
                }

                // Créer la tâche
                const task = taskRepository.create({
                    label: taskData.label,
                    iconUrl: taskData.iconUrl,
                    frequenceEstimee: taskData.frequenceEstimee,
                    uniteFrequence: taskData.uniteFrequence,
                    points: taskData.points,
                    group: existingGroup,
                    tag: tag || undefined
                });

                await taskRepository.save(task);
                console.log(`✅ Tâche créée: ${task.label} (${task.points} points, ${task.frequenceEstimee} ${task.uniteFrequence})`);
            } else {
                console.log(`ℹ️  Tâche existante: ${existingTask.label}`);
            }
        }

        console.log('🎉 Groupe et tâches créés avec succès !');
    }
} 