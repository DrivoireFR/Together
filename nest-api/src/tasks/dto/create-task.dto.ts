import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  label: string;

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
