import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserTaskStatesService } from './user-task-states.service';
import { UpdateUserTaskStateDto } from './dto/update-user-task-state.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('User Task States')
@ApiBearerAuth()
@Controller('user-task-states')
@UseGuards(AuthGuard)
export class UserTaskStatesController {
  constructor(private readonly userTaskStatesService: UserTaskStatesService) {}

  @Put(':taskId')
  @ApiOperation({ summary: 'Marquer une tâche comme prise en connaissance' })
  @ApiParam({ name: 'taskId', type: Number })
  @ApiResponse({ status: 200, description: 'État mis à jour' })
  updateTaskState(
    @Param('taskId') taskId: string,
    @Body() updateDto: UpdateUserTaskStateDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userTaskStatesService.updateTaskState(
      +taskId,
      req.user.userId,
      updateDto,
    );
  }

  @Get('group/:groupId')
  @ApiOperation({
    summary: "Récupérer les états de tâches de l'utilisateur dans un groupe",
  })
  @ApiParam({ name: 'groupId', type: Number })
  getUserTaskStates(
    @Param('groupId') groupId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userTaskStatesService.getUserTaskStates(
      +groupId,
      req.user.userId,
    );
  }
}
