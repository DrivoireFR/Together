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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Congrats')
@ApiBearerAuth()
@Controller('congrats')
@UseGuards(AuthGuard)
export class CongratsController {
  constructor(private readonly congratsService: CongratsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les congrats' })
  findAll() {
    return this.congratsService.findAll();
  }

  @Get('tag/:tagId')
  @ApiOperation({ summary: 'Lister les congrats par tag' })
  @ApiParam({ name: 'tagId', type: Number })
  findByTag(@Param('tagId') tagId: string) {
    return this.congratsService.findByTag(+tagId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un congrats par ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.congratsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un congrats' })
  create(@Body() createCongratsDto: CreateCongratsDto) {
    return this.congratsService.create(createCongratsDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un congrats' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id') id: string,
    @Body() updateCongratsDto: UpdateCongratsDto,
  ) {
    return this.congratsService.update(+id, updateCongratsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un congrats' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.congratsService.remove(+id);
  }
}
