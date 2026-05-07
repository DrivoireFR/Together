import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCongratsDto {
  @ApiPropertyOptional({ description: 'Message de félicitation' })
  @IsOptional()
  @IsNotEmpty()
  message?: string;

  @ApiPropertyOptional({ description: 'ID du tag associé', example: 1 })
  @IsOptional()
  @IsNumber()
  tagId?: number;
}
