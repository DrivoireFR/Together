import { IsNotEmpty, IsHexColor, IsNumber } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  label: string;

  @IsHexColor()
  color: string;

  @IsNumber()
  groupId: number;
}
