import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/entities/user.entity';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'secret', 
            signOptions: { expiresIn: '24h' }, 
          }),
          forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
