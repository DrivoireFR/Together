import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CongratsService } from './congrats.service';
import { CreateCongratsDto } from './dto/create-congrats.dto';
import { UpdateCongratsDto } from './dto/update-congrats.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('congrats')
export class CongratsController {
  constructor(private readonly congratsService: CongratsService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.congratsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('tag/:tagId')
  findByTag(@Param('tagId') tagId: string) {
    return this.congratsService.findByTag(+tagId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.congratsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCongratsDto: CreateCongratsDto) {
    return this.congratsService.create(createCongratsDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCongratsDto: UpdateCongratsDto,
  ) {
    return this.congratsService.update(+id, updateCongratsDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.congratsService.remove(+id);
  }
}
