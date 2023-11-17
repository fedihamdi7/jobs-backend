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

    readonly role?: string;

    @IsOptional()
    @MinLength(8, { message: 'The phone number must be 8 characters long' })
    @MaxLength(8, { message: 'The phone number must be 8 characters long' })
    readonly phone?: number;

    @IsOptional()
    readonly adresse?: string;

    @IsOptional()
    readonly nationality?: string;

    @IsDate(
        { message: 'Invalid date' },
    )
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
