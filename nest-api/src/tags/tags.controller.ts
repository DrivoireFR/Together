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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
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

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('tags')
@UseGuards(AuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un tag dans un groupe' })
  @ApiResponse({ status: 201, description: 'Tag créé avec succès' })
  @ApiResponse({ status: 400, description: 'Nom de tag déjà existant dans le groupe' })
  create(@Body() createTagDto: CreateTagDto, @Request() req: RequestWithUser) {
    return this.tagsService.create(createTagDto, req.user.userId);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Lister les tags d\'un groupe' })
  @ApiParam({ name: 'groupId', type: Number })
  findByGroupId(
    @Param('groupId') groupId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tagsService.findByGroupId(+groupId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un tag par ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tagsService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un tag' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tagsService.update(+id, updateTagDto, req.user.userId);
  }

  @Delete(':id')
  @Timeout(TimeoutValues.HEAVY)
  @ApiOperation({ summary: 'Supprimer un tag (détache les tâches liées)' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tagsService.remove(+id, req.user.userId);
  }
}
