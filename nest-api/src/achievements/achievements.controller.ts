import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
@UseGuards(AuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les achievements' })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Achievements d'un utilisateur" })
  @ApiParam({ name: 'userId', type: Number })
  findByUser(@Param('userId') userId: string) {
    return this.achievementsService.findByUser(+userId);
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: "Stats des achievements d'un utilisateur" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  getStats(
    @Param('userId') userId: string,
    @Query('groupId') groupId?: string,
  ) {
    return this.achievementsService.getStats(
      +userId,
      groupId ? +groupId : undefined,
    );
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: "Achievements d'un groupe" })
  @ApiParam({ name: 'groupId', type: Number })
  findByGroup(@Param('groupId') groupId: string) {
    return this.achievementsService.findByGroup(+groupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un achievement par ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un achievement' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un achievement' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}
