import { IsOptional, IsNotEmpty, IsHexColor } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
