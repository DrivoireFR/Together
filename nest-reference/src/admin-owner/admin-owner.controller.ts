import {
    Controller,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AdminOwnerService } from './admin-owner.service';
import { UpdatePartnerRegistrationAdminDto } from './dto/update-partner-registration-admin.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin/partner-registrations')
@UseGuards(AuthGuard, AdminGuard)
export class AdminOwnerController {
    constructor(private readonly adminOwnerService: AdminOwnerService) { }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdatePartnerRegistrationAdminDto,
        @Request() request,
    ) {
        const adminId = request.user.sub;
        return this.adminOwnerService.updatePartnerRegistration(id, updateDto, adminId);
    }
}

