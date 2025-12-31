import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '../auth/auth.guard';
import { Timeout, TimeoutValues } from '../common/decorators/timeout.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard)
  @Get('group/:groupId/overview')
  @Timeout(TimeoutValues.HEAVY)
  getOverview(@Param('groupId') groupId: string) {
    return this.statsService.getOverview(+groupId);
  }
}
