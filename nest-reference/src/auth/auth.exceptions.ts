import { HttpException } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
    constructor() { super('User already exists', 409) }
}

export class UserDoesntExistsException extends HttpException {
    constructor() { super("User doesn't exists", 404) }
}

export class SessionExpiredException extends HttpException {
    constructor() { super("Votre session a expiré, merci de vous reconnecter", 401) }
}