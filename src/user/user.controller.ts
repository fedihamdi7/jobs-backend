import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UniqueEmailExceptionFilter } from 'src/exceptions/unique-email.exception';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';



@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new UniqueEmailExceptionFilter())
  @UseInterceptors(FileInterceptor('profilePic',
  {
    storage: diskStorage({
      destination: './assets/profile-pics',
      filename: (req, file, cb) => {
        const originalName = file.originalname.split('.');
        const extension = originalName[originalName.length - 1];
        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        const fileName = `${randomName}.${extension}`;
        file.originalname = fileName;
        cb(null, fileName);
        
      }
    })
})
  )
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file : Express.Multer.File) {   
    return this.userService.create(createUserDto, file);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { 
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
