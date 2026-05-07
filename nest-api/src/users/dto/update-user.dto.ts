import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Avatar } from '../enums/avatar.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nom de famille', example: 'Dupont' })
  @IsOptional()
  @IsNotEmpty()
  nom?: string;

  @ApiPropertyOptional({ description: 'Prénom', example: 'Jean' })
  @IsOptional()
  @IsNotEmpty()
  prenom?: string;

  @ApiPropertyOptional({ description: 'Pseudo unique', example: 'jdupont' })
  @IsOptional()
  @IsNotEmpty()
  pseudo?: string;

  @ApiPropertyOptional({ description: 'Avatar', enum: Avatar })
  @IsOptional()
  @IsEnum(Avatar)
  avatar?: Avatar;
}
