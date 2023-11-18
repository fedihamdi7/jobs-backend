import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NegotiationDocument } from './entities/negotiation.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class NegotiationService {

  constructor(
    @InjectModel('Negotiation') private readonly negotiationModel: Model<NegotiationDocument>,
  ) {}

  async create(createNegotiationDto: CreateNegotiationDto) {
    const negotiation = new this.negotiationModel(createNegotiationDto);
    negotiation.user_id = new Types.ObjectId(createNegotiationDto.user_id);
    negotiation.company_id = new Types.ObjectId(createNegotiationDto.company_id);
    negotiation.post_id = new Types.ObjectId(createNegotiationDto.post_id);
    if (await negotiation.save()){
      return
    }else{
      throw new BadRequestException('Something went wrong, Try again later'); 
    }
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

  async accept (negotiation_id: string){
    const negotiation = await this.negotiationModel.findById(negotiation_id);
    if (negotiation){
      negotiation.status = 'accepted';
      if (await negotiation.save()){
        return
      }else{
        throw new BadRequestException('Something went wrong, Try again later'); 
      }
    }else{
      throw new BadRequestException('Negotiation not found'); 
    }
  }
}
