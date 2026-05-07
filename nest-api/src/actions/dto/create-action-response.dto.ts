import { ApiProperty } from '@nestjs/swagger';

class ActionTagDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  color: string;
}

class ActionTaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  points: number;

  @ApiProperty({ type: ActionTagDto, nullable: true })
  tag: ActionTagDto | null;
}

class ActionUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  pseudo: string;

  @ApiProperty({ nullable: true })
  avatar: string | null;
}

class ActionGroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nom: string;

  @ApiProperty()
  code: string;
}

class ActionDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ type: ActionTaskDto })
  task: ActionTaskDto;

  @ApiProperty({ type: ActionUserDto })
  user: ActionUserDto;

  @ApiProperty({ type: ActionGroupDto })
  group: ActionGroupDto;
}

export class CreateActionResponseDto {
  @ApiProperty({ example: 'Action créée avec succès' })
  message: string;

  @ApiProperty({ type: ActionDetailDto })
  action: ActionDetailDto;

  @ApiProperty({ description: 'Total des points réalisés ce mois', example: 42 })
  totalDone: number;
}
