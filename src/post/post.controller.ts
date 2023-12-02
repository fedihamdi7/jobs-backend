import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards, Sse, Req, SetMetadata } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/guards/roles.guard';


@Controller('post')
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles('company')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto,@Req() req : any) {
    return this.postService.create(createPostDto,req.user.id);
  }

  @Get()
  @Roles('user','company','admin')
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch('toggleStatus/:id')
  toggleStatus(@Param('id') id: string) {
    return this.postService.toggleStatus(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  //get all posts of a company
  @Get('user/:id')
  findAllPostsOfUser(@Param('id') id: string) {    
    return this.postService.findAllPostsOfUser(id);
  }

  //add a post to saved posts of a user
  @Post('save/:id')
  @Roles('user')
  saveUnsavePost(@Param('id') id: string, @Headers('user_id') userId: string) {
    return this.postService.savePost(id, userId);
  }

  // user applyinh to a post
  // TODO : move this to negotiation controller
  @Post('apply/:post_id')
  @Roles('user')
  applyToPost(@Param('post_id') postId: string, @Headers('user_id') userId: string) {
    return this.postService.applyToPost(postId, userId);
  }


  @Get('notification/stream/:id')
  @Sse()
  whenNewApplication(@Param('id') id : string){
    return this.postService.getNotificationStream(id);
  }

}
