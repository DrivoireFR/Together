import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Group } from '../groups/entities/group.entity';
import { Task } from '../tasks/entities/task.entity';
import { Congrats } from '../congrats/entities/congrats.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  private readonly TRANSACTION_TIMEOUT = 30000; // 30 secondes

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
    const startTime = Date.now();
    this.logger.log(`Deleting tag ${id} by user ${userId}`);

    const queryRunner =
      this.tagRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Transaction timeout after ${this.TRANSACTION_TIMEOUT}ms`));
      }, this.TRANSACTION_TIMEOUT);
    });

    try {
      const result = await Promise.race([
        this.executeDelete(queryRunner, id, userId),
        timeoutPromise,
      ]);

      await queryRunner.commitTransaction();
      const duration = Date.now() - startTime;
      this.logger.log(
        `Tag ${id} deleted in ${duration}ms: ${result.tasksUpdated} tasks updated, ${result.congratsRemoved} congrats removed`,
      );

      return {
        message: 'Tag supprimé avec succès',
        ...result,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof Error && err.message.includes('timeout')) {
        const duration = Date.now() - startTime;
        this.logger.error(
          `Transaction timeout for tag ${id} deletion after ${duration}ms`,
        );
        throw new RequestTimeoutException(
          'La suppression du tag a pris trop de temps. Veuillez réessayer.',
        );
      }

      this.logger.error(`Error deleting tag ${id}: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async executeDelete(
    queryRunner: QueryRunner,
    id: number,
    userId: number,
  ): Promise<{ tasksUpdated: number; congratsRemoved: number }> {
    const tag = await queryRunner.manager.findOne(Tag, {
      where: { id },
      relations: ['group'],
    });

    if (!tag) {
      throw new NotFoundException('Tag non trouvé');
    }

    if (!tag.group) {
      throw new NotFoundException('Groupe associé non trouvé');
    }

    if (!tag.group.users) {
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: tag.group.id },
        relations: ['users'],
      });

      if (!group) {
        throw new NotFoundException('Groupe associé non trouvé');
      }

      tag.group = group;
    }

    const isMember = tag.group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour supprimer ce tag',
      );
    }

    const tasksCountResult = await queryRunner.manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Task, 'task')
      .where('task.tagId = :tagId', { tagId: id })
      .getRawOne<{ count: string }>();

    const tasksCount = parseInt(tasksCountResult?.count || '0', 10);
    let tasksUpdated = 0;

    if (tasksCount > 0) {
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(Task)
        .set({ tag: null })
        .where('tagId = :tagId', { tagId: id })
        .execute();

      tasksUpdated = updateResult.affected || 0;
    }

    const congratsCountResult = await queryRunner.manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Congrats, 'congrats')
      .where('congrats.tagId = :tagId', { tagId: id })
      .getRawOne<{ count: string }>();

    const congratsCount = parseInt(congratsCountResult?.count || '0', 10);
    let congratsRemoved = 0;

    if (congratsCount > 0) {
      const deleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Congrats)
        .where('tagId = :tagId', { tagId: id })
        .execute();

      congratsRemoved = deleteResult.affected || 0;
    }

    await queryRunner.manager.remove(Tag, tag);

    return {
      tasksUpdated,
      congratsRemoved,
    };
  }
}
