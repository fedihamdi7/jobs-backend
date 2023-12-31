import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { NegotiationModule } from './negotiation/negotiation.module';

@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/jobs'),
    UserModule,
    AuthModule,
    PostModule,
    NegotiationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
