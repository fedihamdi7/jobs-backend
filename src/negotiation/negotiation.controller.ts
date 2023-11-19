import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, UseGuards, Sse } from '@nestjs/common';
import { NegotiationService } from './negotiation.service';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { AuthGuard } from '@nestjs/passport';
import { NegotiationDocument } from './entities/negotiation.entity';

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

  @Post('accept/')
  accept(@Req() req : any, @Body() negotiation: NegotiationDocument){
    return this.negotiationService.accept(req.user,negotiation);
  }

  @Post('reject/')
  reject(@Req() req : any, @Body() negotiation: NegotiationDocument){
    
    return this.negotiationService.reject(req.user,negotiation);
  }

  @Post('requestChanges/')
  requestChanges(@Req() req : any, @Body() negotiation: NegotiationDocument){
    return this.negotiationService.requestChanges(req.user,negotiation);
  }

  @Get('notification/stream')
  @Sse()
  stream(@Req() req : any){
    return this.negotiationService.getNotifications(req.user.id);
  }

}
