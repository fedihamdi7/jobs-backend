import { Body, Controller, Post, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UniqueEmailExceptionFilter } from 'src/exceptions/unique-email.exception';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(AnyFilesInterceptor(FileUploadInterceptor))
    create(@Body() createUserDto: CreateUserDto, @UploadedFiles() files : Express.Multer.File[]) {   
        const profilePic = files.find(file => file.fieldname === 'profilePic');
        const resume = files.find(file => file.fieldname === 'resume'); 
        
      return this.authService.create(createUserDto, profilePic,resume);    
    }
}
