import {
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsUrl,
  IsIn,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsPositive()
  frequenceEstimee?: number;

  @IsOptional()
  @IsIn(['jour', 'semaine', 'mois'])
  uniteFrequence?: string;

  @IsOptional()
  @IsNumber()
  tagId?: number;

  @IsOptional()
  @IsPositive()
  points?: number;
}
