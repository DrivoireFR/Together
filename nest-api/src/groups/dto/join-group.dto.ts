import { IsNotEmpty } from 'class-validator';

export class JoinGroupDto {
  @IsNotEmpty()
  code: string;
}
