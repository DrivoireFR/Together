import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  nom?: string;

  @IsOptional()
  @IsNotEmpty()
  prenom?: string;

  @IsOptional()
  @IsNotEmpty()
  pseudo?: string;

  @IsOptional()
  icone?: string;
}
