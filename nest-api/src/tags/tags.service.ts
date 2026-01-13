import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Group } from '../groups/entities/group.entity';
import { Task } from '../tasks/entities/task.entity';
import { Congrats } from '../congrats/entities/congrats.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) { }

  async create(createTagDto: CreateTagDto, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: createTagDto.groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour créer un tag',
      );
    }

    const existingTag = await this.tagRepository.findOne({
      where: { label: createTagDto.label, group: { id: createTagDto.groupId } },
    });

    if (existingTag) {
      throw new BadRequestException(
        'Un tag avec ce nom existe déjà dans ce groupe',
      );
    }

    const tag = new Tag();
    tag.label = createTagDto.label;
    tag.color = createTagDto.color;
    tag.group = group;
    if (createTagDto.icon) {
      tag.icon = createTagDto.icon;
    }

    await this.tagRepository.save(tag);

    return {
      message: 'Tag créé avec succès',
      tag,
    };
  }

  async findAll() {
    const tags = await this.tagRepository.find({
      relations: ['group', 'tasks'],
    });

    return {
      message: 'Tags récupérés avec succès',
      tags,
    };
  }

  async findByGroupId(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour voir ses tags',
      );
    }

    const tags = await this.tagRepository.find({
      where: { group: { id: groupId } },
      relations: ['group', 'tasks'],
    });

    return {
      message: 'Tags du groupe récupérés avec succès',
      tags,
    };
  }

  async findOne(id: number, userId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['group', 'tasks'],
    });

    if (!tag) {
      throw new NotFoundException('Tag non trouvé');
    }

    const group = await this.groupRepository.findOne({
      where: { id: tag.group.id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe associé non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour voir ce tag',
      );
    }

    return {
      message: 'Tag récupéré avec succès',
      tag,
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto, userId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!tag) {
      throw new NotFoundException('Tag non trouvé');
    }

    const group = await this.groupRepository.findOne({
      where: { id: tag.group.id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe associé non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour modifier ce tag',
      );
    }

    if (updateTagDto.label && updateTagDto.label !== tag.label) {
      const existingTag = await this.tagRepository.findOne({
        where: { label: updateTagDto.label, group: { id: tag.group.id } },
      });
      if (existingTag) {
        throw new BadRequestException(
          'Un tag avec ce nom existe déjà dans ce groupe',
        );
      }
    }

    if (updateTagDto.label) tag.label = updateTagDto.label;
    if (updateTagDto.color) tag.color = updateTagDto.color;
    if (updateTagDto.icon !== undefined) tag.icon = updateTagDto.icon;

    await this.tagRepository.save(tag);

    return {
      message: 'Tag mis à jour avec succès',
      tag,
    };
  }

  async remove(id: number, userId: number) {
    const queryRunner =
      this.tagRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Charger le tag avec toutes ses relations
      const tag = await queryRunner.manager.findOne(Tag, {
        where: { id },
        relations: ['group', 'tasks', 'congrats'],
      });

      if (!tag) {
        throw new NotFoundException('Tag non trouvé');
      }

      // 2. Vérifier les permissions
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: tag.group.id },
        relations: ['users'],
      });

      if (!group) {
        throw new NotFoundException('Groupe associé non trouvé');
      }

      const isMember = group.users.some((user) => user.id === userId);
      if (!isMember) {
        throw new ForbiddenException(
          'Vous devez être membre du groupe pour supprimer ce tag',
        );
      }

      // 3. Mettre à jour les tâches : retirer la référence au tag (mettre à null)
      if (tag.tasks && tag.tasks.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Task)
          .set({ tag: null })
          .where('tagId = :tagId', { tagId: id })
          .execute();
      }

      // 4. Supprimer les congrats associés
      if (tag.congrats && tag.congrats.length > 0) {
        await queryRunner.manager.remove(Congrats, tag.congrats);
      }

      // 5. Supprimer le tag
      await queryRunner.manager.remove(Tag, tag);

      await queryRunner.commitTransaction();

      return {
        message: 'Tag supprimé avec succès',
        tasksUpdated: tag.tasks?.length || 0,
        congratsRemoved: tag.congrats?.length || 0,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
