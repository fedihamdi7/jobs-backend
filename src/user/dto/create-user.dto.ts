import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'The name is required' })
    readonly name: string;

    @IsEmail({}, { message: 'Invalid email'})
    @IsNotEmpty({ message: 'The email is required' })
    readonly email: string;

    @IsNotEmpty({ message: 'The Password is required' })
    readonly password: string;

    readonly profilePic?: string;
}
