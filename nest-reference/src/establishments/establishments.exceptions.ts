import { HttpException, HttpStatus } from "@nestjs/common";

export class KeyInvalidException extends HttpException {
    constructor() { super('Google Maps API key is not configured or invalid', HttpStatus.FORBIDDEN) }
}