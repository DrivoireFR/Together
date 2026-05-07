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
import { CreateActionResponseDto } from './dto/create-action-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Actions')
@ApiBearerAuth()
@Controller('actions')
@UseGuards(AuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Déclarer une action (toujours pour l\'utilisateur connecté)' })
  @ApiResponse({ status: 201, type: CreateActionResponseDto })
  create(
    @Body() createActionDto: CreateActionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.actionsService.create(createActionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les actions (paginé)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'currentMonthOnly', required: false, type: String })
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

  @Get('me')
  @ApiOperation({ summary: 'Lister mes propres actions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'fullHistory', required: false, type: String })
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

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lister les actions d\'un utilisateur' })
  @ApiParam({ name: 'userId', type: Number })
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

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Lister les actions d\'un groupe' })
  @ApiParam({ name: 'groupId', type: Number })
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

  @Get('group/:groupId/recent')
  @ApiOperation({ summary: 'Les 50 dernières actions du groupe' })
  @ApiParam({ name: 'groupId', type: Number })
  findRecentByGroupId(@Param('groupId') groupId: string) {
    return this.actionsService.findRecentByGroupId(+groupId);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Lister les actions par tâche' })
  @ApiParam({ name: 'taskId', type: Number })
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

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une action par ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une action (propriétaire uniquement)' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.actionsService.update(+id, updateActionDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une action (propriétaire uniquement)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.actionsService.remove(+id, req.user.userId);
  }
}
