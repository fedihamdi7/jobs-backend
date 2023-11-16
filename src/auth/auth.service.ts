import { BadRequestException, Injectable } from '@nestjs/common';
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

    const payload = { id: user._id };
    const token = await this.generateToken(payload);
    return { user, token };
  }

  async generateToken(payload: { id: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {

    // Parse the links property into a JavaScript object
    if (typeof createUserDto.links === 'string') {
      try {
        createUserDto.links = JSON.parse(createUserDto.links);

      } catch (error) {
        throw new BadRequestException('Links must be a valid JSON object');

      }
    }

    const createdUser = new this.userModel(createUserDto);

    if (file) {
      // If a file was provided, add its information to the user
      createdUser.profilePic = file.filename;
    }

    return createdUser.save();


  }
}