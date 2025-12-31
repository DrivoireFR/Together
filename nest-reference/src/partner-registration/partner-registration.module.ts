import { Module } from '@nestjs/common';
import { PartnerRegistrationService } from './partner-registration.service';
import { PartnerRegistrationController } from './partner-registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerRegistration } from './entities/partner-registration.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerRegistration]), MailModule],
  controllers: [PartnerRegistrationController],
  providers: [PartnerRegistrationService],
})
export class PartnerRegistrationModule { }
