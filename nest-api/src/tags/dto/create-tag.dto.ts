import { IsNotEmpty, IsHexColor, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Icon } from '../enums/icon.enum';

export class CreateTagDto {
  @ApiProperty({ description: 'Nom du tag', example: 'Ménage' })
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Couleur hexadécimale', example: '#FF5733' })
  @IsHexColor()
  color: string;

  @ApiProperty({ description: 'ID du groupe', example: 1 })
  @IsNumber()
  groupId: number;

  @ApiPropertyOptional({ description: 'Icône', enum: Icon })
  @IsOptional()
  @IsEnum(Icon)
  icon?: Icon;
}
