import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { RequestOtpDto, RequestOtpResponseDto } from './dto/request-otp.dto';
import { VerifyOtpDto, VerifyOtpResponseDto } from './dto/verify-otp.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { RequestWithUser } from './types';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Créer un compte et envoyer un code OTP par email' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email ou pseudo déjà utilisé' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      return await this.authService.register(registerDto);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Un problème est survenu: ' + (err as Error).message, 500);
    }
  }

  @Post('request-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Demander un code OTP par email (login ou renvoi)' })
  @ApiResponse({ status: 201, type: RequestOtpResponseDto })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto): Promise<RequestOtpResponseDto> {
    try {
      return await this.authService.requestOtp(requestOtpDto.email);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Un problème est survenu: ' + (err as Error).message, 500);
    }
  }

  @Post('verify-otp')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Vérifier le code OTP et obtenir un JWT' })
  @ApiResponse({ status: 201, type: VerifyOtpResponseDto })
  @ApiResponse({ status: 400, description: 'Code OTP invalide ou expiré' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return await this.authService.verifyOtp(
        verifyOtpDto.email,
        verifyOtpDto.code,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Un problème est survenu: ' + (err as Error).message, 500);
    }
  }

  @UseGuards(AuthGuard)
  @SkipThrottle()
  @Get('verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier la validité du token JWT' })
  @ApiResponse({ status: 200, description: 'Token valide' })
  @ApiResponse({ status: 401, description: 'Token invalide ou expiré' })
  verifyToken(@Request() req: RequestWithUser) {
    return this.authService.verifyToken(req.user);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle()
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  async getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @SkipThrottle()
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renouveler le token JWT' })
  @ApiResponse({ status: 201, description: 'Token renouvelé' })
  async refreshToken(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.user.userId);
  }
}
