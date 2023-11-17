import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NegotiationService } from './negotiation.service';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';

@Controller('negotiation')
export class NegotiationController {
  constructor(private readonly negotiationService: NegotiationService) {}

  @Post()
  create(@Body() createNegotiationDto: CreateNegotiationDto) {
    return this.negotiationService.create(createNegotiationDto);
  }

  @Get()
  findAll() {
    return this.negotiationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.negotiationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNegotiationDto: UpdateNegotiationDto) {
    return this.negotiationService.update(id, updateNegotiationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.negotiationService.remove(id);
  }
}
