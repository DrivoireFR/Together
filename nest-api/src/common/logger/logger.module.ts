import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston.logger';

@Global()
@Module({
  providers: [
    {
      provide: WinstonLoggerService,
      useFactory: () => new WinstonLoggerService(),
    },
  ],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
