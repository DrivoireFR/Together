import { IsOptional, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class UpdateCongratsDto {
  @IsOptional()
  @IsIn([1, 2])
  level?: number;

  @IsOptional()
  @IsNotEmpty()
  message?: string;

  @IsOptional()
  @IsNumber()
  tagId?: number;
}
