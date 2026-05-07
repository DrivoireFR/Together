import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGroupDto {
  @ApiProperty({
    description: "Code d'accès du groupe (8 caractères)",
    example: 'AB12CD34',
  })
  @IsNotEmpty()
  code: string;
}
