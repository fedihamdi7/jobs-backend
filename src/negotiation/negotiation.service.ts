import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NegotiationDocument, StatusType } from './entities/negotiation.entity';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Type } from 'class-transformer';

@Injectable()
export class NegotiationService {

  constructor(
    @InjectModel('Negotiation') private readonly negotiationModel: Model<NegotiationDocument>,
  ) { }

  async create(createNegotiationDto: CreateNegotiationDto) {
    const negotiation = new this.negotiationModel(createNegotiationDto);
    negotiation.user_id = new Types.ObjectId(createNegotiationDto.user_id);
    negotiation.company_id = new Types.ObjectId(createNegotiationDto.company_id);
    negotiation.post_id = new Types.ObjectId(createNegotiationDto.post_id);
    if (await negotiation.save()) {
      return
    } else {
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
    return this.negotiationModel.findByIdAndUpdate(id, updateNegotiationDto, { new: true });
  }

  remove(id: string) {
    return this.negotiationModel.findByIdAndDelete(id);
  }

  // ACCEPT REQUEST
  async accept(user: UserDocument, negotiation: NegotiationDocument) {

    await this.handleAuthorization(user, negotiation);

    negotiation.user_id = new Types.ObjectId(negotiation.user_id);
    negotiation.company_id = new Types.ObjectId(negotiation.company_id);
    negotiation.post_id = new Types.ObjectId(negotiation.post_id);
    if (user.role === 'company') {
      if (negotiation.status === StatusType.PENDING) {

        negotiation.status = StatusType.PENDING_USER_CONFIRMATION
      }
      else if (negotiation.status === StatusType.PENDING_COMPANY_CONFIRMATION) {

        negotiation.agreedOnDate = negotiation.dateFromTheUser;
        negotiation.status = StatusType.ACCEPTED;

      }
    }
    else {
      if (negotiation.status === StatusType.PENDING_USER_CONFIRMATION) {

        negotiation.agreedOnDate = negotiation.dateFromTheCompany;
        negotiation.status = StatusType.ACCEPTED;

      }
    }

    const savedNegotiation = await this.negotiationModel.findByIdAndUpdate({ _id: new Types.ObjectId(negotiation._id) }, negotiation, { new: true });
    return savedNegotiation;

  }



  // REQUEST CHANGES
  async requestChanges(user: UserDocument, negotiation: NegotiationDocument) {

    await this.handleAuthorization(user, negotiation);

    negotiation.user_id = new Types.ObjectId(negotiation.user_id);
    negotiation.company_id = new Types.ObjectId(negotiation.company_id);
    negotiation.post_id = new Types.ObjectId(negotiation.post_id);

    if (user.role === 'user') {
      if (negotiation.status === StatusType.PENDING_USER_CONFIRMATION) {
        negotiation.status = StatusType.PENDING_COMPANY_CONFIRMATION;
      }
    } else {
      if (negotiation.status === StatusType.PENDING_COMPANY_CONFIRMATION) {
        negotiation.status = StatusType.PENDING_USER_CONFIRMATION;
      }
    }
    const savedNegotiation = await this.negotiationModel.findByIdAndUpdate({ _id: new Types.ObjectId(negotiation._id) }, negotiation, { new: true });
    return savedNegotiation;

  }

  // REJECT REQUEST
  async reject(user: UserDocument, negotiation: NegotiationDocument) {

    await this.handleAuthorization(user, negotiation);

    this.negotiationModel.findByIdAndUpdate(negotiation._id, { status: StatusType.REJECTED });
    return { message: 'Negotiation rejected' }

  }

  // HANDLE AUTHORIZATION
  async handleAuthorization(user: UserDocument, negotiation: NegotiationDocument) {
    if (negotiation.status === StatusType.ACCEPTED) {
      throw new BadRequestException('Negotiation already accepted');
    }
    if (negotiation.status === StatusType.REJECTED) {
      throw new BadRequestException('Negotiation already rejected');
    }


    if (user.role === 'company') {
      if (negotiation.company_id != user._id) {
        throw new BadRequestException('You are not authorized to perform this action');
      }
    } else {
      if (negotiation.user_id != user._id) {
        throw new BadRequestException('You are not authorized to perform this action');
      }
    }

  }
}
