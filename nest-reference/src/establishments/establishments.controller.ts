import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { GooglePlaceService } from './google-place.service';
import { PlaceDetailResponseDto, SearchEstablishmentDto } from './dto/search-establishment.dto';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService, private readonly googlePlaceService: GooglePlaceService) { }

  @Post('search')
  async search(@Body() searchEstablishmentDto: SearchEstablishmentDto) {
    const { search } = searchEstablishmentDto

    try {
      const placesData: PlaceDetailResponseDto[] = await this.googlePlaceService.fetchPlace(search)

      if (placesData.length === 0) {
        return [];
      }

      const establishments = await this.establishmentsService.createMany(placesData)

      return establishments
    }
    catch (err) {
      return err;
    }
  }

  @Post()
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(createEstablishmentDto);
  }

  @Get()
  findAll() {
    return this.establishmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(id);
  }
}
