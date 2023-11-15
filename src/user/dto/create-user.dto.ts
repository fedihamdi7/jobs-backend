import { IsEmail, IsNotEmpty, IsDate, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'The name is required' })
    readonly name: string;

    @IsEmail({}, { message: 'Invalid email'})
    @IsNotEmpty({ message: 'The email is required' })
    readonly email: string;

    @IsNotEmpty({ message: 'The Password is required' })
    readonly password: string;

    readonly profilePic?: string;

    readonly role?: string;

    @MinLength(8, { message: 'The phone number must be 8 characters long' })
    @MaxLength(8, { message: 'The phone number must be 8 characters long' })
    readonly phone?: number;

    readonly adresse?: string;

    readonly nationality?: string;

    @IsDate(
        { message: 'Invalid date' },
    )
    @IsOptional()
    readonly birthDate?: Date;

    readonly governorate?: string;
}
