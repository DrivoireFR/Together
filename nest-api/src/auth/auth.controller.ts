import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RegisterUserDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from './auth.guard';
import { RememberMeGuard } from './remember-me.guard';
import type { RequestWithUser } from './types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

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

  // Rate limit: 3 requests per minute for forgot password
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return await this.authService.requestPasswordReset(
        forgotPasswordDto.email,
      );
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

  // Rate limit: 5 requests per minute for reset password GET
  @Get('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async getResetPassword(
    @Query('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    try {
      if (!token || !email) {
        return res.render('reset-password-error', {
          error: 'Lien de réinitialisation invalide',
          frontendUrl,
        });
      }

      const isValid = await this.authService.verifyPasswordResetToken(
        token,
        email,
      );

      if (!isValid) {
        return res.render('reset-password-error', {
          error: 'Le lien de réinitialisation est invalide ou a expiré.',
          frontendUrl,
        });
      }

      return res.render('reset-password', {
        token,
        email,
      });
    } catch (err) {
      return res.render('reset-password-error', {
        error:
          'Un problème est survenu. Veuillez réessayer ou demander un nouveau lien.',
        frontendUrl,
      });
    }
  }

  // Rate limit: 5 requests per minute for reset password POST
  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async postResetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    try {
      await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );

      return res.redirect(`${frontendUrl}/login?reset=success`);
    } catch (err) {
      return res.render('reset-password-error', {
        error:
          err instanceof HttpException
            ? err.message
            : 'Un problème est survenu. Veuillez réessayer.',
        frontendUrl,
      });
    }
  }

  // Rate limit: 5 requests per minute for change password
  @UseGuards(AuthGuard)
  @Put('change-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      return await this.authService.changePassword(
        req.user.userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
      );
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
}
