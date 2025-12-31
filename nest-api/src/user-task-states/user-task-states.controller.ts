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

@Controller('user-task-states')
export class UserTaskStatesController {
  constructor(private readonly userTaskStatesService: UserTaskStatesService) {}

  @UseGuards(AuthGuard)
  @Put(':taskId')
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

  @UseGuards(AuthGuard)
  @Get('group/:groupId')
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
