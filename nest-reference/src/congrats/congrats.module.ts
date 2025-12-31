import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongratsService } from './congrats.service';
import { CongratsController } from './congrats.controller';
import { Congrats } from './entities/congrats.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Congrats, Tag])],
  controllers: [CongratsController],
  providers: [CongratsService],
  exports: [CongratsService],
})
export class CongratsModule {}
