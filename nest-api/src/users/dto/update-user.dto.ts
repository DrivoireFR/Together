import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Avatar } from '../enums/avatar.enum';

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
  @IsEnum(Avatar)
  avatar?: Avatar;
}
