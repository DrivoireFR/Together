import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  // Rate limit: 30 actions per minute
  @UseGuards(AuthGuard)
  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  create(
    @Body() createActionDto: CreateActionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.actionsService.create(createActionDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.actionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMyActions(@Request() req: RequestWithUser) {
    return this.actionsService.findMyActions(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.actionsService.findByUserId(+userId);
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId')
  findByGroupId(@Param('groupId') groupId: string) {
    return this.actionsService.findByGroupId(+groupId);
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId/recent')
  findRecentByGroupId(@Param('groupId') groupId: string) {
    return this.actionsService.findRecentByGroupId(+groupId);
  }

  @UseGuards(AuthGuard)
  @Get('task/:taskId')
  findByTaskId(@Param('taskId') taskId: string) {
    return this.actionsService.findByTaskId(+taskId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.actionsService.update(+id, updateActionDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.actionsService.remove(+id, req.user.userId);
  }
}
