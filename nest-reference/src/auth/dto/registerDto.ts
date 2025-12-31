import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import { UserType } from "src/users/entities/user.entity";

export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsIn(Object.values(UserType))
    @IsNotEmpty()
    role: UserType;
}

export class RegisterUserResponseDto {
    email: string;
    role: UserType;
}
