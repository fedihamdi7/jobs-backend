import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, UseGuards } from '@nestjs/common';
import { NegotiationService } from './negotiation.service';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('negotiation')
@UseGuards(AuthGuard('jwt'))
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

  @Post('accept/:negotiation_id')
  accept(@Param('negotiation_id') negotiation_id: string,@Req() req : any){
    console.log(req.user);
    // TODO : test this
    // return this.negotiationService.accept(negotiation_id);
  }

}
