import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StarterPackTaskDto {
  @IsNotEmpty()
  label: string;

  @IsOptional()
  iconUrl?: string;

  @IsPositive()
  frequenceEstimee: number;

  @IsNotEmpty()
  uniteFrequence: string;

  @IsPositive()
  points: number;

  @IsNotEmpty()
  tagLabel: string;
}

export class AddTasksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StarterPackTaskDto)
  tasks: StarterPackTaskDto[];
}
