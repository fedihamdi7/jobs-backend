import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Subject } from 'rxjs';
import { NegotiationService } from 'src/negotiation/negotiation.service';

@Injectable()
export class PostService {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly negotiationService : NegotiationService
  ) { }

  async create(createPostDto: CreatePostDto, userId: string) {
    createPostDto.company = new Types.ObjectId(userId);
    const createdPost = await this.postModel.create(createPostDto);

    // Add the new post's ID to the user's posts array
    await this.userModel.findByIdAndUpdate(userId, { $push: { posts: createdPost._id } });
    return createdPost;
  }

  findAll() {
    return this.postModel.find({isActive : true}).populate('company').sort({ dateOfCreation: -1 });;
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  async toggleStatus(id: string) {
    const post = await this.postModel.findById(id);
    const updatedPost = await this.postModel.findByIdAndUpdate(id, { isActive: !post.isActive }, { new: true });
    return updatedPost;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
    return updatedPost;
  }

  remove(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }

  async findAllPostsOfUser(id: string) {
    const user: any = await this.userModel.findById(id);
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        return await this.postModel.findById(postId).exec();
      })
    );    
    return populatedPosts;
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
      //get the company id 
      const post = await this.postModel.findById(postId);
      const companyId = post.company;
      
      const createdNegotiation : any = await this.negotiationService.create(
        {
          user_id : userId,
          company_id : companyId,
          post_id : postId,
          status : "PENDING",
          dateFromTheCompany : {when : null, where : null},
          dateFromTheUser : {when : null, where : null},
          agreedOnDate : {when : null, where : null},
          link : null,
          additionalInfoCompany : null,
          additionalInfoUser : null,
        }
      )
      await this.addNotification(
        {
          _id : new Types.ObjectId(),
          message : "New applicant to your post",
          seen : false,
          user : new Types.ObjectId(userId),
          post : new Types.ObjectId(postId),
          negotiation : new Types.ObjectId(createdNegotiation._id)
        },
        companyId.toString()
        );
      return { message: 'Applied to post successfully' };
    } else {
      // Post is already applied, unapply to it
      throw new BadRequestException('Already applied to this post');
    }
  }


  private notificationStreams = new Map<string, Subject<any>>();


  getNotificationStream(connectedUserId: string): Subject<any> {
    if (!this.notificationStreams.has(connectedUserId)) {
      this.notificationStreams.set(connectedUserId, new Subject<any>());
    }
    this.getUserNotifications(connectedUserId);

    return this.notificationStreams.get(connectedUserId);
  }
  
  async addNotification(notification: any, userId: string) {
    notification.createdAt = new Date();
    notification.createdAt.setHours(notification.createdAt.getHours() + 1);
   
    // $slice limit the array to 50 elements and $position is where to put the new entry
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { notifications: { $each: [notification], $position: 0 , $slice : -50} } },
      { new: true }
    );
    const userStream = this.notificationStreams.get(userId);

    if (userStream) {
      userStream.next(JSON.stringify({ userId, notifications: [user.notifications] }));
    }
  } 
  
  async getUserNotifications(userId: string) {
    const user = await this.userModel.findById(userId);
    const populatedNotifications = await Promise.all(
      user.notifications.map(async (notification) => {
        return await this.userModel.populate(notification, [{ path: 'user' ,select : 'name'},{path:'negotiation',model: 'Negotiation'}]);
      })
    );
    const userStream = this.notificationStreams.get(userId);

    if (userStream) {
      userStream.next(JSON.stringify({ userId, notifications: [populatedNotifications] }));
    }
  }


  async markNotificationAsSeen(notificationId: string, userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const notification = await user.notifications.map(notif => {
        if (notif._id.toString() === notificationId) {
          notif.seen = true;
        }

        return notif;
      });
      user.notifications = notification;
      const userStream = this.notificationStreams.get(userId);
      const populatedNotifications = await Promise.all(
        user.notifications.map(async (notification) => {
          return await this.userModel.populate(notification, [{ path: 'user' ,select : 'name'},{path:'negotiation',model: 'Negotiation'}]);
        })
      );

      // update the stream
      if (userStream) {
        userStream.next(JSON.stringify({ userId, notifications: [populatedNotifications] }));
      }
      return this.userModel.findByIdAndUpdate(userId, user);

    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  }

  async clearNotifications(userId: string) {
    try {
      // Find the user by ID
      const user = await this.userModel.findById(userId);

      if (!user) {
        // Handle the case where the user is not found
        throw new Error('User not found');
      }

      // Clear the notifications array
      user.notifications = [];

      // Save the updated user document
      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      // Handle errors (e.g., database errors)
      throw new Error(`Failed to clear notifications: ${error.message}`);
    }
  }


}
