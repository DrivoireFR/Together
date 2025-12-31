import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerRegistrationDto } from './create-partner-registration.dto';

export class UpdatePartnerRegistrationDto extends PartialType(CreatePartnerRegistrationDto) {}
