import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  userId: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
