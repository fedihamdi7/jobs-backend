import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.where({ email }).findOne();

  }

  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (typeof updateUserDto.links === 'string') {
      try {
        const newLinks = JSON.parse(updateUserDto.links);
        updateUserDto.links = { ...user.links.toObject(), ...newLinks };
      } catch (error) {
        throw new BadRequestException('Links must be a valid JSON object');
      }
    }

    if (file) {
      updateUserDto.profilePic = file.filename;
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

}
