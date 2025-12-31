import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateAchievementDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  groupId: number;

  @IsNumber()
  congratsId: number;

  @IsOptional()
  @IsDateString()
  achievedAt?: string;
}
