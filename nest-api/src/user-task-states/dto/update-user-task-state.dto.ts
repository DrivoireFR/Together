import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserTaskStateDto {
  @ApiProperty({
    description: 'Marquer la tâche comme prise en connaissance',
    example: true,
  })
  @IsBoolean()
  isAcknowledged: boolean;
}
