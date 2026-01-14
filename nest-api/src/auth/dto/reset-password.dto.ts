import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    newPassword: string;
}
