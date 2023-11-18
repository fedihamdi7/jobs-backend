import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './entities/post.entity';
import { UserSchema } from 'src/user/entities/user.entity';
import { NegotiationService } from 'src/negotiation/negotiation.service';
import { NegotiationSchema } from 'src/negotiation/entities/negotiation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Negotiation', schema: NegotiationSchema}
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, NegotiationService],
})
export class PostModule {}
