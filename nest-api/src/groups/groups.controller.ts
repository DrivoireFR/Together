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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddTasksDto } from './dto/add-tasks.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';
import { Timeout, TimeoutValues } from '../common/decorators/timeout.decorator';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Rate limit: 3 group creations per minute
  @UseGuards(AuthGuard)
  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.create(createGroupDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  @Timeout(TimeoutValues.HEAVY)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.groupsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @UseGuards(AuthGuard)
  @Get('search')
  searchByName(@Query('nom') nom: string, @Query('limit') limit?: string) {
    return this.groupsService.searchByName(nom, limit ? +limit : 20);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  @Timeout(TimeoutValues.HEAVY)
  findUserGroups(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.groupsService.findUserGroups(
      +userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @Timeout(TimeoutValues.HEAVY)
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.findOne(+id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/hot-actions')
  @Timeout(TimeoutValues.HEAVY)
  getHotActions(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.getHotActions(+id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/join')
  joinGroup(
    @Param('id') id: string,
    @Body() joinGroupDto: JoinGroupDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.joinGroup(
      +id,
      req.user.userId,
      joinGroupDto.code,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id/leave')
  leaveGroup(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.leaveGroup(+id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/tags')
  addTags(
    @Param('id') id: string,
    @Body() addTagsDto: AddTagsDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.addTags(+id, req.user.userId, addTagsDto.tags);
  }

  @UseGuards(AuthGuard)
  @Post(':id/tasks')
  addTasks(
    @Param('id') id: string,
    @Body() addTasksDto: AddTasksDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.addTasks(+id, req.user.userId, addTasksDto.tasks);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
