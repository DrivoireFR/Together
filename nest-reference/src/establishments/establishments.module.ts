import { Module } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';
import { Establishment } from './entities/establishment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GooglePlaceService } from './google-place.service';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment])],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService, GooglePlaceService],
})
export class EstablishmentsModule { }
