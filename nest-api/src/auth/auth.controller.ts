import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './auth.guard';
import { RememberMeGuard } from './remember-me.guard';
import type { RequestWithUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
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

  @Post('login')
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

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@Request() req: RequestWithUser) {
    return this.authService.verifyToken(req.user);
  }

  @UseGuards(RememberMeGuard)
  @Get('remember-me')
  async rememberMe(@Request() req: RequestWithUser) {
    return this.authService.rememberMeVerify(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }
}
