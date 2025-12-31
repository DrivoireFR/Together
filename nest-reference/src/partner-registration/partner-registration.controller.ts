import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { PartnerRegistrationService } from './partner-registration.service';
import { CreatePartnerRegistrationDto } from './dto/create-partner-registration.dto';
import { UpdatePartnerRegistrationDto } from './dto/update-partner-registration.dto';

@Controller('partner-registration')
export class PartnerRegistrationController {
  constructor(private readonly partnerRegistrationService: PartnerRegistrationService) { }

  @Post()
  create(@Body() createPartnerRegistrationDto: CreatePartnerRegistrationDto) {
    return this.partnerRegistrationService.create(createPartnerRegistrationDto);
  }

  @Get()
  findAll() {
    return this.partnerRegistrationService.findAll();
  }

  @Get('/to-process')
  findOnesToProcess() {
    return this.partnerRegistrationService.findNotProcessedOnes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerRegistrationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerRegistrationDto: UpdatePartnerRegistrationDto) {
    return this.partnerRegistrationService.update(+id, updatePartnerRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerRegistrationService.remove(+id);
  }
}
