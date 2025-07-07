import { AppDataSource } from '../config/database';
import { Tag } from '../entities/Tag';
import { Congrats } from '../entities/Congrats';

interface TagData {
  label: string;
  color: string;
  level1Message: string;
  level2Message: string;
}

const defaultTagsData: TagData[] = [
  {
    label: 'Ménage',
    color: '#3B82F6',
    level1Message: 'Bon début ! Continuer comme ça, votre foyer devient plus agréable ! 🧹',
    level2Message: 'Félicitations ! Votre maison est impeccable ! Vous maîtrisez l\'art du ménage ! ✨'
  },
  {
    label: 'Animal de compagnie',
    color: '#10B981',
    level1Message: 'Super ! Votre animal de compagnie vous remercie pour ces bons soins ! 🐾',
    level2Message: 'Bravo ! Vous êtes un parent parfait pour votre animal ! Il est chanceux de vous avoir ! 🏆'
  },
  {
    label: 'Cuisine',
    color: '#F59E0B',
    level1Message: 'Excellent ! Vous progressez bien en cuisine, continuez à régaler ! 👨‍🍳',
    level2Message: 'Incroyable ! Vous êtes devenu un véritable chef ! Vos plats sont délicieux ! 🍽️'
  },
  {
    label: 'Courses',
    color: '#EF4444',
    level1Message: 'Bien joué ! Vous gérez bien vos courses, c\'est un bon start ! 🛒',
    level2Message: 'Parfait ! Vous êtes un pro de l\'organisation pour les courses ! Rien ne vous échappe ! 🎯'
  }
];

export class TagsAndCongratsSeeder {
  public static async run(): Promise<void> {
    const tagRepository = AppDataSource.getRepository(Tag);
    const congratsRepository = AppDataSource.getRepository(Congrats);

    console.log('🌱 Création des tags par défaut et de leurs congrats...');

    for (const tagData of defaultTagsData) {
      // Vérifier si le tag existe déjà
      let existingTag = await tagRepository.findOne({
        where: { label: tagData.label, isDefault: true }
      });

      if (!existingTag) {
        // Créer le tag par défaut
        const tag = tagRepository.create({
          label: tagData.label,
          color: tagData.color,
          isDefault: true
        });
        existingTag = await tagRepository.save(tag);
        console.log(`✅ Tag créé: ${tag.label}`);
      } else {
        console.log(`ℹ️  Tag existant: ${existingTag.label}`);
      }

      // Créer les congrats pour ce tag (niveau 1 et 2)
      for (let level = 1; level <= 2; level++) {
        const existingCongrats = await congratsRepository.findOne({
          where: { tag: { id: existingTag.id }, level: level }
        });

        if (!existingCongrats) {
          const message = level === 1 ? tagData.level1Message : tagData.level2Message;
          const congrats = congratsRepository.create({
            level: level,
            message: message,
            tag: existingTag
          });
          await congratsRepository.save(congrats);
          console.log(`✅ Congrats niveau ${level} créé pour ${existingTag.label}`);
        } else {
          console.log(`ℹ️  Congrats niveau ${level} existant pour ${existingTag.label}`);
        }
      }
    }

    console.log('🎉 Seeder terminé avec succès !');
  }
}