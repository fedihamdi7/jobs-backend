import { IsEmail, IsNotEmpty, IsDate, MinLength, MaxLength, IsOptional, IsEmpty } from "class-validator";
import { Types } from "mongoose";
import { UserAppliedNotification } from "../entities/user.entity";

export class CreateUserDto {

    @IsNotEmpty({ message: 'The name is required' })
    readonly name: string;

    @IsEmail({}, { message: 'Invalid email'})
    @IsNotEmpty({ message: 'The email is required' })
    readonly email: string;

    @IsNotEmpty({ message: 'The Password is required' })
    readonly password: string;

    @IsOptional()
    readonly profilePic?: string;

    @IsOptional()
    readonly role?: string;

    @IsOptional()
    readonly phone?: string;

    @IsOptional()
    readonly adresse?: string;

    @IsOptional()
    readonly nationality?: string;

    @IsOptional()
    readonly birthDate?: Date;

    @IsOptional()
    readonly governorate?: string;

    @IsOptional()
    readonly resume?: string;

    @IsOptional()
    links?: {
        github: string;
        linkedin: string;
        facebook: string;
        twitter: string;
        instagram: string;
        website: string;
        location: string;
    };

    @IsOptional()
    postsAppliedIn : Types.ObjectId[];

    @IsOptional()
    savedPosts : Types.ObjectId[];

    @IsEmpty()
    notifications: UserAppliedNotification[];
}
