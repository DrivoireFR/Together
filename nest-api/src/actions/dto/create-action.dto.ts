import { IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({ description: 'ID de la tâche réalisée', example: 1 })
  @IsNumber()
  taskId: number;

  @ApiProperty({ description: 'Date de réalisation (ISO 8601)', example: '2026-05-07' })
  @IsDateString()
  date: string;
}
