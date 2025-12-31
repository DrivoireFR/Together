import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerRegistration } from '../partner-registration/entities/partner-registration.entity';
import { Establishment } from '../establishments/entities/establishment.entity';
import { User } from '../users/entities/user.entity';
import { AdminOwnerController } from './admin-owner.controller';
import { AdminOwnerService } from './admin-owner.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PartnerRegistration, Establishment, User]),
        MailModule
    ],
    controllers: [AdminOwnerController],
    providers: [AdminOwnerService],
})
export class AdminOwnerModule { }

