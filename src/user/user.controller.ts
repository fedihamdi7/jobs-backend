import { Controller, Get, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UniqueEmailExceptionFilter } from 'src/exceptions/unique-email.exception';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
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
  @UseFilters(new UniqueEmailExceptionFilter())
  @UseInterceptors(AnyFilesInterceptor(FileUploadInterceptor))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFiles() files : Express.Multer.File[]) {
    const profilePic = files?.find(file => file.fieldname === 'profilePic');
    const resume = files?.find(file => file.fieldname === 'resume'); 
    return this.userService.update(id, updateUserDto, profilePic, resume);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
