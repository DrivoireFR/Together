import { IsOptional, IsNotEmpty, IsHexColor, IsEnum } from 'class-validator';
import { Icon } from '../enums/icon.enum';

export class UpdateTagDto {
  @IsOptional()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsEnum(Icon)
  icon?: Icon;
}
