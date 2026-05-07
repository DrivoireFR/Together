import {
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Nom de la tâche' })
  @IsOptional()
  @IsNotEmpty()
  label?: string;

  @ApiPropertyOptional({ description: 'Fréquence estimée', example: 3 })
  @IsOptional()
  @IsPositive()
  frequenceEstimee?: number;

  @ApiPropertyOptional({
    description: 'Unité de fréquence',
    enum: ['jour', 'semaine', 'mois'],
  })
  @IsOptional()
  @IsIn(['jour', 'semaine', 'mois'])
  uniteFrequence?: string;

  @ApiPropertyOptional({ description: 'ID du tag associé', example: 1 })
  @IsOptional()
  @IsNumber()
  tagId?: number;

  @ApiPropertyOptional({ description: 'Points attribués', example: 5 })
  @IsOptional()
  @IsPositive()
  points?: number;
}
