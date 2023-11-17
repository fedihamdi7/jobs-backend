import { Injectable } from '@nestjs/common';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NegotiationDocument } from './entities/negotiation.entity';
import { Model } from 'mongoose';

@Injectable()
export class NegotiationService {

  constructor(
    @InjectModel('Negotiation') private readonly negotiationModel: Model<NegotiationDocument>,
  ) {}

  create(createNegotiationDto: CreateNegotiationDto) {
    return this.negotiationModel.create(createNegotiationDto);
  }

  findAll() {
    return this.negotiationModel.find();
  }

  findOne(id: string) {
    return this.negotiationModel.findById(id);
  }

  update(id: string, updateNegotiationDto: UpdateNegotiationDto) {
    return this.negotiationModel.findByIdAndUpdate(id, updateNegotiationDto, {new: true});
  }

  remove(id: string) {
    return this.negotiationModel.findByIdAndDelete(id);
  }
}
