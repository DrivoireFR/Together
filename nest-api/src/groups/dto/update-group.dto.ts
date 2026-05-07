import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiPropertyOptional({ description: 'Nouveau nom du groupe', example: 'Les Colocs 2.0' })
  @IsOptional()
  @IsNotEmpty()
  nom?: string;
}
