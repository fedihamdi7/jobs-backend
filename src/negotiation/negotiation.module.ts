import { Module } from '@nestjs/common';
import { NegotiationService } from './negotiation.service';
import { NegotiationController } from './negotiation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NegotiationSchema } from './entities/negotiation.entity';
import { UserSchema } from 'src/user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Negotiation', schema: NegotiationSchema },
      { name : 'User', schema : UserSchema },
    ])
  ],
  controllers: [NegotiationController],
  providers: [NegotiationService],
})
export class NegotiationModule {}
