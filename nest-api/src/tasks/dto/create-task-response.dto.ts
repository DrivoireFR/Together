import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TaskGroupDto {
  @ApiProperty() id: number;
  @ApiProperty() nom: string;
  @ApiProperty() code: string;
}

class TaskTagDto {
  @ApiProperty() id: number;
  @ApiProperty() label: string;
  @ApiProperty() color: string;
  @ApiPropertyOptional() icon?: string;
}

class TaskDetailDto {
  @ApiProperty() id: number;
  @ApiProperty() label: string;
  @ApiProperty() frequenceEstimee: number;
  @ApiProperty() uniteFrequence: string;
  @ApiProperty() points: number;
  @ApiProperty({ type: TaskGroupDto }) group: TaskGroupDto;
  @ApiProperty({ type: TaskTagDto, nullable: true }) tag: TaskTagDto | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class CreateTaskResponseDto {
  @ApiProperty({ example: 'Tâche créée avec succès' })
  message: string;

  @ApiProperty({ type: TaskDetailDto })
  task: TaskDetailDto;
}
