import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OwnerOverviewService } from './owner-overview.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { OwnerGuard } from 'src/auth/owner.guard';

@Controller('owner-overview')
export class OwnerOverviewController {
    constructor(private readonly ownerOverviewService: OwnerOverviewService) { }

    @UseGuards(AuthGuard, OwnerGuard)
    @Get()
    async findOwnerEstablishment(@Request() req) {
        return this.ownerOverviewService.findOwnerEstablishment(req.user.sub);
    }
}
