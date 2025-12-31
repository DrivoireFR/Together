import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard)
  @Get('group/:groupId/overview')
  getOverview(@Param('groupId') groupId: string) {
    return this.statsService.getOverview(+groupId);
  }
}
