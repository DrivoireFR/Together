import {
  IsArray,
  IsNotEmpty,
  IsHexColor,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StarterPackTagDto {
  @ApiProperty({ description: 'Nom du tag', example: 'Ménage' })
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Couleur hexadécimale', example: '#FF5733' })
  @IsHexColor()
  color: string;
}

export class AddTagsDto {
  @ApiProperty({ type: [StarterPackTagDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StarterPackTagDto)
  tags: StarterPackTagDto[];
}
