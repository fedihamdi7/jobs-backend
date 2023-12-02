import { Controller, Get, Param, Sse, UseGuards } from '@nestjs/common';
import { NotifGuard, Roles } from 'src/guards/notif.guard';
import { PostService } from 'src/post/post.service';

@Controller('notification')
@UseGuards(NotifGuard)
export class NotificationController {
  constructor(private readonly postService: PostService) {}

  @Get('/stream/:id')
  @Sse()
  @Roles('company')
  whenNewApplication(@Param('id') id : string){
    return this.postService.getNotificationStream(id);
  }
}
