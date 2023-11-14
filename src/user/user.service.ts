import { Catch, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { log } from 'console';

@Injectable()
export class UserService {

 constructor(
  @InjectModel(User.name) private readonly userModel: Model<User>,
 ) {}


  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);  
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string) : Promise<User | null> {
    return this.userModel.where({email}).findOne();
    
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

}
