import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    name: string;
    email: string;
    password?: string;    
    profilePic?: string;
    role?: string;
    phone?: number;
    adresse?: string;
    nationality?: string;
    birthDate?: Date;
    governorate?: string;
    resume?: string;
    links?: {
        github: string;
        linkedin: string;
        facebook: string;
        twitter: string;
        instagram: string;
        website: string;
    };
    isVerified?: boolean;
    posts?: Types.ObjectId[];
    
}
