import { Injectable } from '@nestjs/common';
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

  update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const updatedUserDto = file
      ? { ...updateUserDto, profilePic: file.originalname }
      : updateUserDto;
  
    return this.userModel.findByIdAndUpdate(id, updatedUserDto, { new: true });
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

}
