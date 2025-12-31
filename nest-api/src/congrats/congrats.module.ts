import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongratsService } from './congrats.service';
import { CongratsController } from './congrats.controller';
import { Congrats } from './entities/congrats.entity';
import { Tag } from '../tags/entities/tag.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Congrats, Tag]),
    JwtModule,
  ],
  controllers: [CongratsController],
  providers: [CongratsService],
  exports: [CongratsService],
})
export class CongratsModule { }
