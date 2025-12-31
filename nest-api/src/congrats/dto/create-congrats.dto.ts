import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CreateCongratsDto {
  @IsIn([1, 2])
  level: number;

  @IsNotEmpty()
  message: string;

  @IsNumber()
  tagId: number;
}
