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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Créer un groupe (interdit si déjà dans un groupe)' })
  @ApiResponse({ status: 201, description: 'Groupe créé avec succès' })
  @ApiResponse({ status: 400, description: 'Déjà dans un groupe ou nom existant' })
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.create(createGroupDto, req.user.userId);
  }

  @Get()
  @Timeout(TimeoutValues.HEAVY)
  @ApiOperation({ summary: 'Lister tous les groupes (paginé)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.groupsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher un groupe par nom' })
  @ApiQuery({ name: 'nom', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  searchByName(@Query('nom') nom: string, @Query('limit') limit?: string) {
    return this.groupsService.searchByName(nom, limit ? +limit : 20);
  }

  @Get(':id')
  @Timeout(TimeoutValues.HEAVY)
  @ApiOperation({ summary: 'Récupérer un groupe avec ses tâches et membres' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.findOne(+id, req.user.userId);
  }

  @Get(':id/hot-actions')
  @Timeout(TimeoutValues.HEAVY)
  @ApiOperation({ summary: 'Récupérer les tâches urgentes du groupe' })
  @ApiParam({ name: 'id', type: Number })
  getHotActions(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.getHotActions(+id, req.user.userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Rejoindre un groupe avec un code' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 201, description: 'Groupe rejoint' })
  @ApiResponse({ status: 400, description: 'Déjà dans un groupe' })
  @ApiResponse({ status: 403, description: 'Code invalide' })
  joinGroup(
    @Param('id') id: string,
    @Body() joinGroupDto: JoinGroupDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.joinGroup(+id, req.user.userId, joinGroupDto.code);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Quitter le groupe' })
  @ApiParam({ name: 'id', type: Number })
  leaveGroup(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.leaveGroup(+id, req.user.userId);
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Ajouter des tags au groupe (starter pack)' })
  @ApiParam({ name: 'id', type: Number })
  addTags(
    @Param('id') id: string,
    @Body() addTagsDto: AddTagsDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.addTags(+id, req.user.userId, addTagsDto.tags);
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Ajouter des tâches au groupe (starter pack)' })
  @ApiParam({ name: 'id', type: Number })
  addTasks(
    @Param('id') id: string,
    @Body() addTasksDto: AddTasksDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.addTasks(+id, req.user.userId, addTasksDto.tasks);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un groupe' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req: RequestWithUser,
  ) {
    return this.groupsService.update(+id, updateGroupDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un groupe (si aucune donnée liée)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.groupsService.remove(+id, req.user.userId);
  }
}
