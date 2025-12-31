import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { OwnerOverviewController } from './owner-overview.controller';
import { OwnerOverviewService } from './owner-overview.service';

@Module({
    imports: [TypeOrmModule.forFeature([Establishment])],
    controllers: [OwnerOverviewController],
    providers: [OwnerOverviewService],
})
export class OwnerOverviewModule { }
