import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Subject } from 'rxjs';

@Injectable()
export class PostService {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

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
    const user: any = await this.userModel.findById(id).populate('posts');
    return user.posts;

  }

  async savePost(id: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const savedPosts = user.savedPosts.map(post => post.toString());
    const postIndex = savedPosts.indexOf(id);

    if (postIndex === -1) {
      // Post is not saved yet, save it
      await this.userModel.findByIdAndUpdate(userId, { $push: { savedPosts: new Types.ObjectId(id) } });
      await this.postModel.findByIdAndUpdate(id, { $inc: { numberOfSaved: 1 } });
      return { message: 'Post saved successfully' };
    } else {
      // Post is already saved, unsave it
      await this.userModel.findByIdAndUpdate(userId, { $pull: { savedPosts: new Types.ObjectId(id) } });
      await this.postModel.findByIdAndUpdate(id, { $inc: { numberOfSaved: -1 } });
      return { message: 'Post unsaved successfully' };
    }

  }


  async applyToPost(postId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    
 
    const appliedPosts =  user.postsAppliedIn?.map(post => post.toString());
    
    const postIndex = appliedPosts?.indexOf(postId);

    if (postIndex === -1) {
      // Post is not applied yet, apply to it
      await this.userModel.findByIdAndUpdate(userId, { $push: { postsAppliedIn: new Types.ObjectId(postId) } });
      await this.postModel.findByIdAndUpdate(postId, { $inc: { applicants: 1 } });
      await this.addNotificaiton({type : 'user-applied', user : userId, post : postId},userId);
      return { message: 'Applied to post successfully' };
    } else {
      // Post is already applied, unapply to it
      throw new BadRequestException('Already applied to this post');
    }
  }


  private connectedUserId : string;
  private notifications = new Subject<any>()  ;
  async getNotificationStream(connectedUserId: string) {
    this.connectedUserId = connectedUserId;
    this.getUserNotifications(connectedUserId);
    return this.notifications;
  }
  
  async addNotificaiton(notification: any, userId: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, { $push: { notifications: notification } }, { new: true });
    if(userId === this.connectedUserId){
      this.notifications.next(JSON.stringify({userId, notifications : [user.notifications]}));
    }
  }
  
  async getUserNotifications(userId: string) {
    const user = await this.userModel.findById(userId);
    this.notifications.next(JSON.stringify({userId, notifications : [user.notifications]}));
  }


}
