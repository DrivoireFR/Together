import {
  IsArray,
  IsNotEmpty,
  IsHexColor,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StarterPackTagDto {
  @IsNotEmpty()
  label: string;

  @IsHexColor()
  color: string;
}

export class AddTagsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StarterPackTagDto)
  tags: StarterPackTagDto[];
}
