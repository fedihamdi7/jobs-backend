import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }


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

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.where({ email }).findOne();

  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

}
