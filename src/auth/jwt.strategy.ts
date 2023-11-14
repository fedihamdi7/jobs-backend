import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){


    constructor(
        private userService : UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret'
        });
    }

    async validate(payload: any){
        const { id } = payload;
        const user = await this.userService.findOne(id);

        if(!user){
            throw new UnauthorizedException('Login First to access this endpoint');
        }

        return user;
    }
}