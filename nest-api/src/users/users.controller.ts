import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { RequestWithUser } from '../auth/types';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserProfileEnvelopeDto } from './dto/user-profile-envelope.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer son propre profil avec le groupe' })
  @ApiOkResponse({
    description: 'Profil récupéré avec succès',
    type: UserProfileEnvelopeDto,
  })
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Mettre à jour son profil' })
  @ApiOkResponse({
    description: 'Profil mis à jour avec succès',
    type: UserProfileEnvelopeDto,
  })
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Utilisateur récupéré' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.usersService.remove(+id, req.user.userId);
  }
}
