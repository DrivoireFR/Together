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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
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

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une tâche dans un groupe' })
  @ApiResponse({ status: 201, description: 'Tâche créée avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Nom de tâche déjà existant dans le groupe',
  })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les tâches (paginé)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.tasksService.findAll(page ? +page : 1, limit ? +limit : 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une tâche par ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'includeActions', required: false, type: String })
  @ApiQuery({ name: 'currentMonthOnly', required: false, type: String })
  findOne(
    @Param('id') id: string,
    @Query('includeActions') includeActions?: string,
    @Query('currentMonthOnly') currentMonthOnly?: string,
  ) {
    return this.tasksService.findOne(
      +id,
      includeActions === 'true',
      currentMonthOnly !== 'false',
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une tâche' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(+id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une tâche et ses données liées' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(+id, req.user.userId);
  }
}
