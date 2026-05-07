import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Adresse email du compte', example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Code OTP à 6 chiffres', example: '123456' })
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Dupont' })
  nom: string;

  @ApiProperty({ example: 'Jean' })
  prenom: string;

  @ApiProperty({ example: 'jdupont' })
  pseudo: string;

  @ApiProperty({ example: 'jean@example.com' })
  email: string;

  @ApiProperty({ example: true })
  emailVerified: boolean;

  @ApiProperty({ example: 'avatar1', nullable: true, required: false })
  avatar?: string;

  @ApiProperty({ example: 1, nullable: true, required: false })
  groupId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class VerifyOtpResponseDto {
  @ApiProperty({ example: 'Connexion réussie' })
  message: string;

  @ApiProperty()
  token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
