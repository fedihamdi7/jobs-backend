import { Body, Controller, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UniqueEmailExceptionFilter } from 'src/exceptions/unique-email.exception';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }


    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(email,password);
    }

    @Post('register')
    @UseFilters(new UniqueEmailExceptionFilter())
    @UseInterceptors(FileUploadInterceptor)
    create(@Body() createUserDto: CreateUserDto, @UploadedFile() file : Express.Multer.File) {   
      return this.authService.create(createUserDto, file);
    }
}
