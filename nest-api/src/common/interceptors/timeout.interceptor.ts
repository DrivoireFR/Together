import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TIMEOUT_KEY } from '../decorators/timeout.decorator';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimeoutInterceptor.name);
  private readonly defaultTimeout = 3000; // 3 seconds for standard endpoints

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method: string = request.method;
    const url: string = request.url;

    // Check for custom timeout from decorator
    const customTimeout = this.reflector.getAllAndOverride<number>(
      TIMEOUT_KEY,
      [context.getHandler(), context.getClass()],
    );

    const timeoutValue = customTimeout ?? this.defaultTimeout;

    return next.handle().pipe(
      timeout(timeoutValue),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          this.logger.warn(
            `Request timeout after ${timeoutValue}ms: ${method} ${url}`,
          );
          return throwError(
            () =>
              new RequestTimeoutException(
                `La requête a dépassé le délai de ${timeoutValue / 1000} secondes`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
