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
import { User } from '../users/entities/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  private readonly TRANSACTION_TIMEOUT = 30000;

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private formatTagResponse(tag: Tag): TagResponseDto {
    return {
      id: tag.id,
      label: tag.label,
      color: tag.color,
      isDefault: tag.isDefault,
      icon: tag.icon,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  private async assertMember(userId: number, groupId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.groupId !== groupId) {
      throw new ForbiddenException('Vous devez être membre du groupe');
    }
  }

  async create(createTagDto: CreateTagDto, userId: number) {
    await this.assertMember(userId, createTagDto.groupId);

    const group = await this.groupRepository.findOne({
      where: { id: createTagDto.groupId },
    });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    const existingTag = await this.tagRepository.findOne({
      where: { label: createTagDto.label, group: { id: createTagDto.groupId } },
    });
    if (existingTag) {
      throw new BadRequestException('Un tag avec ce nom existe déjà dans ce groupe');
    }

    const tag = new Tag();
    tag.label = createTagDto.label;
    tag.color = createTagDto.color;
    tag.group = group;
    if (createTagDto.icon) tag.icon = createTagDto.icon;

    await this.tagRepository.save(tag);

    return {
      message: 'Tag créé avec succès',
      tag: this.formatTagResponse(tag),
    };
  }

  async findByGroupId(groupId: number, userId: number) {
    await this.assertMember(userId, groupId);

    const tags = await this.tagRepository.find({
      where: { group: { id: groupId } },
    });

    return {
      message: 'Tags du groupe récupérés avec succès',
      tags,
    };
  }

  async findOne(id: number, userId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!tag) throw new NotFoundException('Tag non trouvé');

    await this.assertMember(userId, tag.group.id);

    return {
      message: 'Tag récupéré avec succès',
      tag: this.formatTagResponse(tag),
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto, userId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!tag) throw new NotFoundException('Tag non trouvé');

    await this.assertMember(userId, tag.group.id);

    if (updateTagDto.label && updateTagDto.label !== tag.label) {
      const existingTag = await this.tagRepository.findOne({
        where: { label: updateTagDto.label, group: { id: tag.group.id } },
      });
      if (existingTag) {
        throw new BadRequestException('Un tag avec ce nom existe déjà dans ce groupe');
      }
    }

    if (updateTagDto.label) tag.label = updateTagDto.label;
    if (updateTagDto.color) tag.color = updateTagDto.color;
    if (updateTagDto.icon !== undefined) tag.icon = updateTagDto.icon;

    await this.tagRepository.save(tag);

    return {
      message: 'Tag mis à jour avec succès',
      tag: this.formatTagResponse(tag),
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
        throw new RequestTimeoutException(
          'La suppression du tag a pris trop de temps. Veuillez réessayer.',
        );
      }

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
    if (!tag) throw new NotFoundException('Tag non trouvé');

    await this.assertMember(userId, tag.group.id);

    let tasksUpdated = 0;
    const tasksCountResult = await queryRunner.manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Task, 'task')
      .where('task.tagId = :tagId', { tagId: id })
      .getRawOne<{ count: string }>();

    if (parseInt(tasksCountResult?.count || '0', 10) > 0) {
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(Task)
        .set({ tag: null })
        .where('tagId = :tagId', { tagId: id })
        .execute();
      tasksUpdated = updateResult.affected || 0;
    }

    let congratsRemoved = 0;
    const congratsCountResult = await queryRunner.manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Congrats, 'congrats')
      .where('congrats.tagId = :tagId', { tagId: id })
      .getRawOne<{ count: string }>();

    if (parseInt(congratsCountResult?.count || '0', 10) > 0) {
      const deleteResult = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Congrats)
        .where('tagId = :tagId', { tagId: id })
        .execute();
      congratsRemoved = deleteResult.affected || 0;
    }

    await queryRunner.manager.remove(Tag, tag);

    return { tasksUpdated, congratsRemoved };
  }
}
