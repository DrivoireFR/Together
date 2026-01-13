import { IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateActionDto {
  @IsNumber()
  taskId: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  userId?: number; // Optionnel : si présent, crée pour cet utilisateur
}
