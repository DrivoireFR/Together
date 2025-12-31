import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import { UserType } from "../entities/user.entity";

export class CreateUserDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsIn(Object.values(UserType))
    @IsNotEmpty({ message: 'Role is required' })
    role: UserType;
}
