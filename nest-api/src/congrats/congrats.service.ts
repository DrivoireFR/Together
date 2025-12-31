import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Congrats } from './entities/congrats.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateCongratsDto } from './dto/create-congrats.dto';
import { UpdateCongratsDto } from './dto/update-congrats.dto';

@Injectable()
export class CongratsService {
  constructor(
    @InjectRepository(Congrats)
    private congratsRepository: Repository<Congrats>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return this.congratsRepository.find({
      relations: ['tag'],
    });
  }

  async findOne(id: number) {
    const congrats = await this.congratsRepository.findOne({
      where: { id },
      relations: ['tag'],
    });

    if (!congrats) {
      throw new NotFoundException('Congrats non trouvé');
    }

    return congrats;
  }

  async findByTag(tagId: number) {
    return this.congratsRepository.find({
      where: { tag: { id: tagId } },
      relations: ['tag'],
    });
  }

  async create(createCongratsDto: CreateCongratsDto) {
    const tag = await this.tagRepository.findOne({
      where: { id: createCongratsDto.tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag non trouvé');
    }

    const congrats = this.congratsRepository.create({
      level: createCongratsDto.level,
      message: createCongratsDto.message,
      tag,
    });

    return this.congratsRepository.save(congrats);
  }

  async update(id: number, updateCongratsDto: UpdateCongratsDto) {
    const congrats = await this.congratsRepository.findOne({
      where: { id },
    });

    if (!congrats) {
      throw new NotFoundException('Congrats non trouvé');
    }

    if (updateCongratsDto.tagId) {
      const tag = await this.tagRepository.findOne({
        where: { id: updateCongratsDto.tagId },
      });
      if (!tag) {
        throw new NotFoundException('Tag non trouvé');
      }
      congrats.tag = tag;
    }

    if (updateCongratsDto.level) congrats.level = updateCongratsDto.level;
    if (updateCongratsDto.message) congrats.message = updateCongratsDto.message;

    return this.congratsRepository.save(congrats);
  }

  async remove(id: number) {
    const result = await this.congratsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Congrats non trouvé');
    }

    return { message: 'Congrats supprimé avec succès' };
  }
}
