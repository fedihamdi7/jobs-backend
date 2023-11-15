import { Controller, Get, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from './entities/user.entity';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRole.ADMIN)
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
