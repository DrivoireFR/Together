import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Avatar } from '../../users/enums/avatar.enum';

export class RegisterDto {
  @ApiProperty({ description: 'Nom de famille', example: 'Dupont' })
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Prénom', example: 'Jean' })
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ description: 'Pseudo unique', example: 'jdupont' })
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({ description: 'Adresse email', example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Avatar', enum: Avatar })
  @IsOptional()
  @IsEnum(Avatar)
  avatar?: Avatar;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'Compte créé. Un code OTP a été envoyé à votre adresse email.',
  })
  message: string;

  @ApiProperty({ example: 'jean@example.com' })
  email: string;
}
