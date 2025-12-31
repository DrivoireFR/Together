import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserTaskStateDto {
  @IsOptional()
  @IsBoolean()
  isAcknowledged?: boolean;

  @IsOptional()
  @IsBoolean()
  isConcerned?: boolean;
}
