import { Injectable } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PlaceDetailResponseDto } from './dto/search-establishment.dto';
import { Establishment } from './entities/establishment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) { }

  create(createEstablishmentDto: CreateEstablishmentDto) {
    return 'This action adds a new establishment';
  }

  async createMany(placeDetailDtos: PlaceDetailResponseDto[]): Promise<Establishment[]> {
    const establishments = placeDetailDtos.map(dto => {
      return {
        id: dto.id,
        name: dto.displayName,
        formattedAddress: dto.formattedAddress,
        places_data: dto
      };
    });

    return this.establishmentsRepository.save(establishments);
  }

  findAll() {
    return this.establishmentsRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} establishment`;
  }

  update(id: number, updateEstablishmentDto: UpdateEstablishmentDto) {
    return `This action updates a #${id} establishment`;
  }

  remove(id: number) {
    return `This action removes a #${id} establishment`;
  }
}
