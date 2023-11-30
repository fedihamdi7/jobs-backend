import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);
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

  async update(id: string, updateUserDto: UpdateUserDto, profilePic?: Express.Multer.File, resume?: Express.Multer.File) {
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

    if (profilePic) {
      if (user.profilePic !== 'default-profile-picture.jpg') {
        await unlinkAsync(`./assets/profile-pics/${user.profilePic}`);
      }
      updateUserDto.profilePic = profilePic.filename;
    }

    if(resume) {
      if (user.resume){
        await unlinkAsync(`./assets/resumes/${user.resume}`);
      }
      updateUserDto.resume = resume.filename;
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

}
