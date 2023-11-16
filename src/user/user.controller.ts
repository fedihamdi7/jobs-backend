import { Controller, Get, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { 
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileUploadInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file : Express.Multer.File) {
    return this.userService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
