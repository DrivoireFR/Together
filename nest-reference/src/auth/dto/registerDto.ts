import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

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
  icone?: string;
}
