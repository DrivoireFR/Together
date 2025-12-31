import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  userId: number;
  email: string;
  rememberMe?: boolean;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
