import { IsOptional, IsDateString } from 'class-validator';

export class UpdateActionDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
