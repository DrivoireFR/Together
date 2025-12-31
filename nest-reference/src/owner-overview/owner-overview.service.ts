import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from 'src/establishments/entities/establishment.entity';

@Injectable()
export class OwnerOverviewService {
    constructor(
        @InjectRepository(Establishment)
        private establishmentsRepository: Repository<Establishment>,
    ) { }

    async findOwnerEstablishment(userId: number): Promise<Establishment | null> {
        return this.establishmentsRepository.findOne({ where: { owner_account_id: userId } });
    }
}
