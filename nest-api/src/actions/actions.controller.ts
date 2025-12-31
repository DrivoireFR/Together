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
  Query,
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
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('currentMonthOnly') currentMonthOnly?: string,
  ) {
    return this.actionsService.findAll(
      page ? +page : 1,
      limit ? +limit : 50,
      currentMonthOnly !== 'false',
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMyActions(
    @Request() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('fullHistory') fullHistory?: string,
  ) {
    return this.actionsService.findMyActions(req.user.userId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      includeFullHistory: fullHistory === 'true',
    });
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('fullHistory') fullHistory?: string,
  ) {
    return this.actionsService.findByUserId(+userId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      includeFullHistory: fullHistory === 'true',
    });
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId')
  findByGroupId(
    @Param('groupId') groupId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('fullHistory') fullHistory?: string,
  ) {
    return this.actionsService.findByGroupId(+groupId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      includeFullHistory: fullHistory === 'true',
    });
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId/recent')
  findRecentByGroupId(@Param('groupId') groupId: string) {
    return this.actionsService.findRecentByGroupId(+groupId);
  }

  @UseGuards(AuthGuard)
  @Get('task/:taskId')
  findByTaskId(
    @Param('taskId') taskId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('fullHistory') fullHistory?: string,
  ) {
    return this.actionsService.findByTaskId(+taskId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      includeFullHistory: fullHistory === 'true',
    });
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
