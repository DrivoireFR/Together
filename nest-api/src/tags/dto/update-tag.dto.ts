import { IsOptional, IsNotEmpty, IsHexColor, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Icon } from '../enums/icon.enum';

export class UpdateTagDto {
  @ApiPropertyOptional({ description: 'Nom du tag', example: 'Cuisine' })
  @IsOptional()
  @IsNotEmpty()
  label?: string;

  @ApiPropertyOptional({ description: 'Couleur hexadécimale', example: '#33FF57' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({ description: 'Icône', enum: Icon })
  @IsOptional()
  @IsEnum(Icon)
  icon?: Icon;
}
