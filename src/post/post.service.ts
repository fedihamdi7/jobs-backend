import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    createPostDto.company = new Types.ObjectId(userId);
    const createdPost = await this.postModel.create(createPostDto);
    return createdPost;
  }

  findAll() {
    return this.postModel.find();
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
    return updatedPost;
  }

  remove(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}
