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

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.achievementsService.findByUser(+userId);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId/stats')
  getStats(
    @Param('userId') userId: string,
    @Query('groupId') groupId?: string,
  ) {
    return this.achievementsService.getStats(
      +userId,
      groupId ? +groupId : undefined,
    );
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId')
  findByGroup(@Param('groupId') groupId: string) {
    return this.achievementsService.findByGroup(+groupId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}
