import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RegisterUserDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './auth.guard';
import { RememberMeGuard } from './remember-me.guard';
import type { RequestWithUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rate limit: 5 requests per minute for registration
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() createUserDto: RegisterUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Un problème est survenu: ' + (err as Error).message,
        500,
      );
    }
  }

  // Rate limit: 5 requests per minute for login
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Un problème est survenu: ' + (err as Error).message,
        500,
      );
    }
  }

  // Rate limit: 3 requests per minute for email confirmation
  @Get('confirm-email')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async confirmEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    try {
      if (!token || !email) {
        throw new HttpException('Token et email requis', 400);
      }
      return await this.authService.confirmEmail(token, email);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Un problème est survenu: ' + (err as Error).message,
        500,
      );
    }
  }

  // Rate limit: 2 requests per minute for resending confirmation email
  @Post('resend-confirmation')
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async resendConfirmation(@Body('email') email: string) {
    try {
      if (!email) {
        throw new HttpException('Email requis', 400);
      }
      return await this.authService.resendConfirmationEmail(email);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Un problème est survenu: ' + (err as Error).message,
        500,
      );
    }
  }

  @UseGuards(AuthGuard)
  @SkipThrottle()
  @Get('verify')
  verifyToken(@Request() req: RequestWithUser) {
    return this.authService.verifyToken(req.user);
  }

  @UseGuards(RememberMeGuard)
  @SkipThrottle()
  @Get('remember-me')
  async rememberMe(@Request() req: RequestWithUser) {
    return this.authService.rememberMeVerify(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle()
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }
}
