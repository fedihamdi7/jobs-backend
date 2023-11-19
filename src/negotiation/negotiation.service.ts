import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNegotiationDto } from './dto/create-negotiation.dto';
import { UpdateNegotiationDto } from './dto/update-negotiation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NegotiationDocument, StatusType } from './entities/negotiation.entity';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Subject } from 'rxjs';

@Injectable()
export class NegotiationService {

  constructor(
    @InjectModel('Negotiation') private readonly negotiationModel: Model<NegotiationDocument>,
    @InjectModel('User') private readonly userModel: Model<User>,

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
    negotiation.status = StatusType.REJECTED
    negotiation.user_id = new Types.ObjectId(negotiation.user_id);
    negotiation.company_id = new Types.ObjectId(negotiation.company_id);
    negotiation.post_id = new Types.ObjectId(negotiation.post_id);

    await this.addNotification(
      {
        _id : new Types.ObjectId(),
        message : "Your application has been rejected",
        seen : false,
        user : new Types.ObjectId(negotiation.user_id),
        post : new Types.ObjectId(negotiation.post_id),
      },
      negotiation.user_id.toString()
      );    
    return this.negotiationModel.findByIdAndUpdate(negotiation._id, negotiation,{new : true});
    
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




  // NOTIFICATIONS
  private notificationStreams = new Map<string, Subject<any>>();

  async getNotifications(connectedUserId: string) {
    if (!this.notificationStreams.has(connectedUserId)) {
      this.notificationStreams.set(connectedUserId, new Subject<any>());
    }
    this.getUserNotifications(connectedUserId);

    return this.notificationStreams.get(connectedUserId);
  }

  async addNotification(notification: any, userId: string) {
    notification.createdAt = new Date();
    notification.createdAt.setHours(notification.createdAt.getHours() + 1);
    
    const user = await this.userModel.findByIdAndUpdate(
      userId.toString(),
      { $push: { notifications: notification } },
      { new: true }
    );
    const userStream = this.notificationStreams.get(userId.toString());

    if (userStream) {
      userStream.next(JSON.stringify({ userId, notifications: [user.notifications] }));
    }
  } 


  async getUserNotifications(userId: string) {
    const user = await this.userModel.findById(userId);
    const userStream = this.notificationStreams.get(userId);

    if (userStream) {
      userStream.next(JSON.stringify({ userId, notifications: [user.notifications] }));
    }
  }
}
