import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PostService } from 'src/post/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/post/entities/post.entity';
import { UserSchema } from 'src/user/entities/user.entity';
import { NegotiationService } from 'src/negotiation/negotiation.service';
import { NegotiationSchema } from 'src/negotiation/entities/negotiation.entity';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService,NegotiationService,PostService,UserService],
  imports:[
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name : 'Negotiation', schema : NegotiationSchema}
    ]),
  ]
})
export class NotificationModule {}
