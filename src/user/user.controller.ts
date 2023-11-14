import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UniqueEmailExceptionFilter } from 'src/exceptions/unique-email.exception';
import { AuthGuard } from '@nestjs/passport';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new UniqueEmailExceptionFilter())
  @UseGuards(AuthGuard())
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.userService.create(createUserDto);
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
