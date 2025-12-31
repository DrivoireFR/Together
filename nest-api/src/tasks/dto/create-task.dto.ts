import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsNumber,
  IsUrl,
  IsIn,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsPositive()
  frequenceEstimee: number;

  @IsOptional()
  @IsIn(['jour', 'semaine', 'mois'])
  uniteFrequence?: string;

  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  tagId?: number;

  @IsOptional()
  @IsPositive()
  points?: number;
}
