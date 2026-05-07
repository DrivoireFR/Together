import { HttpException } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('Un utilisateur avec cet email ou ce pseudo existe déjà', 409);
  }
}

export class UserDoesntExistsException extends HttpException {
  constructor() {
    super('Identifiants invalides', 401);
  }
}
