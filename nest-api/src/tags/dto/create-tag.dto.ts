import { IsNotEmpty, IsHexColor, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Icon } from '../enums/icon.enum';

export class CreateTagDto {
  @IsNotEmpty()
  label: string;

  @IsHexColor()
  color: string;

  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsEnum(Icon)
  icon?: Icon;
}
