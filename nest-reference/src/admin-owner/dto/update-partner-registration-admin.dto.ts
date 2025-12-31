import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartnerRegistrationStatus } from '../../partner-registration/entities/partner-registration.entity';

export class UpdatePartnerRegistrationAdminDto {
    @IsOptional()
    @IsEnum(PartnerRegistrationStatus)
    status?: PartnerRegistrationStatus;

    @IsOptional()
    @IsString()
    admin_notes?: string;

    @IsOptional()
    @IsString()
    rejection_reason?: string;
}

