import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,

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

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const { name, email, password } = createUserDto;

    const createdUser = new this.userModel({
      name,
      email,
      password,
      ...(file && { profilePic: file.originalname }),
    });
        
    return createdUser.save();


  }
}