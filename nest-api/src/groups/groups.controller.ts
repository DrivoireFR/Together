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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddTasksDto } from './dto/add-tasks.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req: RequestWithUser) {
    return this.groupsService.create(createGroupDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('search')
  searchByName(@Query('nom') nom: string) {
    return this.groupsService.searchByName(nom);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findUserGroups(@Param('userId') userId: string) {
    return this.groupsService.findUserGroups(+userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.findOne(+id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/hot-actions')
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
    return this.groupsService.joinGroup(+id, req.user.userId, joinGroupDto.code);
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
