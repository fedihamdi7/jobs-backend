import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
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
  create(@Body() createPostDto: CreatePostDto,@Headers('user_id') userId: string) {   
    return this.postService.create(createPostDto,userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  //get all posts of a user
  @Get('user/:id')
  findAllPostsOfUser(@Param('id') id: string) {
    return this.postService.findAllPostsOfUser(id);
  }
}
