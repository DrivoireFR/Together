import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import type { Request } from 'express';
import type { JwtPayload } from './types';

@Injectable()
export class RememberMeGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token d'accès manquant");
    }
    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') || jwtConstants.secret;
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (!payload.rememberMe) {
        throw new UnauthorizedException('Token non persistant');
      }

      request.user = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token remember me invalide ou expiré');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
