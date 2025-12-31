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

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTagDto: CreateTagDto, @Request() req: RequestWithUser) {
    return this.tagsService.create(createTagDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('group/:groupId')
  findByGroupId(@Param('groupId') groupId: string, @Request() req: RequestWithUser) {
    return this.tagsService.findByGroupId(+groupId, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tagsService.findOne(+id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tagsService.update(+id, updateTagDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tagsService.remove(+id, req.user.userId);
  }
}
