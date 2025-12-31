import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class LoginResponseDto {
  token: string;
  user: any;
  rememberMe?: boolean;
}
