import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/validation.pipe';
import { winstonLoggerService } from './common/logger/winston.logger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLoggerService,
  });

  app.use(
    helmet({
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
      contentSecurityPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:8081',
      'http://localhost',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new CustomValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Together API')
    .setDescription(
      'Together - Gérer les tâches du quotidien à plusieurs, équitablement.\n\n' +
      '## Authentification\n' +
      'L\'API utilise un flux OTP par email :\n' +
      '1. `POST /auth/register` — Créer un compte + envoi OTP\n' +
      '2. `POST /auth/request-otp` — Demander un OTP (login / renvoi)\n' +
      '3. `POST /auth/verify-otp` — Vérifier le code et obtenir un JWT\n\n' +
      'Les endpoints protégés nécessitent un header `Authorization: Bearer <token>`.',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  fs.writeFileSync(
    join(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );
  winstonLoggerService.log('swagger.json generated', 'Swagger');

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  winstonLoggerService.log(`Together API running on port ${port}`, 'Bootstrap');
}
bootstrap();
