import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ description: 'Adresse email du compte', example: 'jean@example.com' })
  @IsEmail()
  email: string;
}

export class RequestOtpResponseDto {
  @ApiProperty({ example: 'Un code OTP a été envoyé à votre adresse email.' })
  message: string;
}
