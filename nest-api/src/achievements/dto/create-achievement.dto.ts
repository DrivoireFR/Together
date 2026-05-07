import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty({ description: "ID de l'utilisateur", example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'ID du groupe', example: 1 })
  @IsNumber()
  groupId: number;

  @ApiProperty({ description: 'ID du congrats', example: 1 })
  @IsNumber()
  congratsId: number;

  @ApiPropertyOptional({
    description: "Date de l'achievement (ISO 8601)",
    example: '2026-05-07',
  })
  @IsOptional()
  @IsDateString()
  achievedAt?: string;
}
