import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Nom du groupe (unique)', example: 'Les Colocs' })
  @IsNotEmpty()
  nom: string;
}
