import { IsNumber, IsDateString } from 'class-validator';

export class CreateActionDto {
  @IsNumber()
  taskId: number;

  @IsDateString()
  date: string;
}
