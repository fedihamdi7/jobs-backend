import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards, Sse, Req, SetMetadata } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/guards/roles.guard';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  create(@Body() createPostDto: CreatePostDto,@Req() req : any) {
    return this.postService.create(createPostDto,req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'),RolesGuard)

  @Roles('user','company','admin')
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch('toggleStatus/:id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  toggleStatus(@Param('id') id: string) {
    return this.postService.toggleStatus(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  //get all posts of a company
  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  findAllPostsOfUser(@Param('id') id: string) {    
    return this.postService.findAllPostsOfUser(id);
  }

  //add a post to saved posts of a user
  @Post('save/:id')
  @Roles('user')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  saveUnsavePost(@Param('id') id: string, @Headers('user_id') userId: string) {
    return this.postService.savePost(id, userId);
  }

  // user applyinh to a post
  // TODO : move this to negotiation controller
  @Post('apply/:post_id')
  @Roles('user')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  applyToPost(@Param('post_id') postId: string, @Headers('user_id') userId: string) {
    return this.postService.applyToPost(postId, userId);
  }

  @Get('notification/stream/:id')
  @Sse()
  @UseGuards()
  whenNewApplication(@Param('id') id : string){
    return this.postService.getNotificationStream(id);
  }

  @Patch('markNotificationAsSeen/:notif_id')
  @UseGuards(AuthGuard('jwt'))
  markNotificationAsSeen(@Param('notif_id') notif_id: string, @Req() req: any) {
    return this.postService.markNotificationAsSeen(notif_id, req.user.id);
  }
}
