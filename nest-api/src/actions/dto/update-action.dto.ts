import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActionDto {
  @ApiPropertyOptional({ description: 'Nouvelle date (ISO 8601)', example: '2026-05-07' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
