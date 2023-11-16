import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    createPostDto.company = new Types.ObjectId(userId);
    const createdPost = await this.postModel.create(createPostDto);

    // Add the new post's ID to the user's posts array
    await this.userModel.findByIdAndUpdate(userId, { $push: { posts: createdPost._id } });
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

  async findAllPostsOfUser(id: string) {
    const user : any = await this.userModel.findById(id).populate('posts');   
    return user.posts;

  }
}
