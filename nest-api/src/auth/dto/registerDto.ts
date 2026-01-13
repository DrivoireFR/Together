import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Avatar } from '../../users/enums/avatar.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;

  @IsNotEmpty()
  pseudo: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Avatar)
  avatar?: Avatar;
}
