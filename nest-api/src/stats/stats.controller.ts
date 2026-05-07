import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';
import { Timeout, TimeoutValues } from '../common/decorators/timeout.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Stats')
@ApiBearerAuth()
@Controller('stats')
@UseGuards(AuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('group/:groupId/overview')
  @Timeout(TimeoutValues.HEAVY)
  @ApiOperation({
    summary: 'Résumé personnel du mois pour le groupe (stats perso)',
  })
  @ApiParam({ name: 'groupId', type: Number })
  @ApiResponse({ status: 200, description: 'Résumé récupéré' })
  getOverview(
    @Param('groupId') groupId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.statsService.getPersonalOverview(+groupId, req.user.userId);
  }
}
