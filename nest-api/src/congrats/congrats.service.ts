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
    const congrats = await this.congratsRepository.find({
      relations: ['tag'],
    });
    return { message: 'Congrats récupérés avec succès', congrats };
  }

  async findOne(id: number) {
    const congrats = await this.congratsRepository.findOne({
      where: { id },
      relations: ['tag'],
    });
    if (!congrats) throw new NotFoundException('Congrats non trouvé');
    return { message: 'Congrats récupéré avec succès', congrats };
  }

  async findByTag(tagId: number) {
    const congrats = await this.congratsRepository.find({
      where: { tag: { id: tagId } },
      relations: ['tag'],
    });
    return { message: 'Congrats du tag récupérés avec succès', congrats };
  }

  async create(createCongratsDto: CreateCongratsDto) {
    let tag: Tag | undefined = undefined;
    if (createCongratsDto.tagId) {
      const foundTag = await this.tagRepository.findOne({
        where: { id: createCongratsDto.tagId },
      });
      if (!foundTag) throw new NotFoundException('Tag non trouvé');
      tag = foundTag;
    }

    const congrats = this.congratsRepository.create({
      message: createCongratsDto.message,
      tag,
    });

    await this.congratsRepository.save(congrats);

    return { message: 'Congrats créé avec succès', congrats };
  }

  async update(id: number, updateCongratsDto: UpdateCongratsDto) {
    const congrats = await this.congratsRepository.findOne({
      where: { id },
    });
    if (!congrats) throw new NotFoundException('Congrats non trouvé');

    if (updateCongratsDto.tagId !== undefined) {
      if (updateCongratsDto.tagId) {
        const tag = await this.tagRepository.findOne({
          where: { id: updateCongratsDto.tagId },
        });
        if (!tag) throw new NotFoundException('Tag non trouvé');
        congrats.tag = tag;
      } else {
        congrats.tag = undefined;
      }
    }

    if (updateCongratsDto.message) congrats.message = updateCongratsDto.message;

    await this.congratsRepository.save(congrats);

    return { message: 'Congrats mis à jour avec succès', congrats };
  }

  async remove(id: number) {
    const result = await this.congratsRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Congrats non trouvé');
    return { message: 'Congrats supprimé avec succès' };
  }
}
