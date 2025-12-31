import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsNotEmpty()
  nom?: string;
}
