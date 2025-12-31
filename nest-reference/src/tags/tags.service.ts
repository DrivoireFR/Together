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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

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

    await this.tagRepository.save(tag);

    return {
      message: 'Tag mis à jour avec succès',
      tag,
    };
  }

  async remove(id: number, userId: number) {
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
        'Vous devez être membre du groupe pour supprimer ce tag',
      );
    }

    if (tag.tasks && tag.tasks.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer le tag car il est utilisé par des tâches',
      );
    }

    await this.tagRepository.remove(tag);

    return {
      message: 'Tag supprimé avec succès',
    };
  }
}
