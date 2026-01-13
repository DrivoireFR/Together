import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('actions/acknowledgments')
@UseGuards(AuthGuard)
export class ActionAcknowledgmentController {
    constructor(private readonly actionsService: ActionsService) { }

    @Get('pending')
    getPending(@Request() req: RequestWithUser) {
        return this.actionsService.getPendingAcknowledgment(req.user.userId);
    }

    @Post(':id/accept')
    accept(
        @Param('id') id: string,
        @Request() req: RequestWithUser,
    ) {
        return this.actionsService.acceptActionAcknowledgment(+id, req.user.userId);
    }

    @Post(':id/reject')
    reject(
        @Param('id') id: string,
        @Request() req: RequestWithUser,
    ) {
        return this.actionsService.rejectActionAcknowledgment(+id, req.user.userId);
    }
}
