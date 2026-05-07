import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCongratsDto {
  @ApiProperty({
    description: 'Message de félicitation',
    example: 'Bravo, tu as bien bossé !',
  })
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'ID du tag associé (optionnel)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  tagId?: number;
}
