import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StarterPackTaskDto {
  @ApiProperty({
    description: 'Nom de la tâche',
    example: "Passer l'aspirateur",
  })
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Fréquence estimée', example: 2 })
  @IsPositive()
  frequenceEstimee: number;

  @ApiProperty({
    description: 'Unité de fréquence',
    example: 'semaine',
    enum: ['jour', 'semaine', 'mois'],
  })
  @IsNotEmpty()
  uniteFrequence: string;

  @ApiProperty({ description: 'Points attribués', example: 3 })
  @IsPositive()
  points: number;

  @ApiProperty({ description: 'Label du tag associé', example: 'Ménage' })
  @IsNotEmpty()
  tagLabel: string;
}

export class AddTasksDto {
  @ApiProperty({ type: [StarterPackTaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StarterPackTaskDto)
  tasks: StarterPackTaskDto[];
}
