import { ValidationPipe, BadRequestException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log('🚨 Validation failed:', JSON.stringify(errors, null, 2));
        return new BadRequestException({
          message: 'Validation failed',
          errors: errors,
        });
      },
    });
  }
}
