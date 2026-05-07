import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsNumber,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Nom de la tâche', example: 'Passer l\'aspirateur' })
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Fréquence estimée', example: 2 })
  @IsPositive()
  frequenceEstimee: number;

  @ApiPropertyOptional({ description: 'Unité de fréquence', enum: ['jour', 'semaine', 'mois'], example: 'semaine' })
  @IsOptional()
  @IsIn(['jour', 'semaine', 'mois'])
  uniteFrequence?: string;

  @ApiProperty({ description: 'ID du groupe', example: 1 })
  @IsNumber()
  groupId: number;

  @ApiPropertyOptional({ description: 'ID du tag associé', example: 1 })
  @IsOptional()
  @IsNumber()
  tagId?: number;

  @ApiPropertyOptional({ description: 'Points attribués', example: 3 })
  @IsOptional()
  @IsPositive()
  points?: number;
}
