import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async login(email: string, password: string) {
    const user: any = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'Invalid credentials email' };
    }
    if (!await bcrypt.compare(password, user.password)) {
      return { message: 'Invalid credentials pwd' };
    }

    const payload = { id : user._id };
    const token = await this.generateToken(payload);
    return { user, token };
  }

  async generateToken(payload: { id: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}