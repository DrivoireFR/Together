import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { RequestWithUser } from '../../auth/types';

/**
 * Query Logger Interceptor
 *
 * Logs all requests and their duration.
 * Warns on slow queries (> threshold) for performance monitoring.
 */
@Injectable()
export class QueryLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(QueryLoggerInterceptor.name);
  private readonly slowQueryThreshold = 1000; // 1 second

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();
    const userId = request.user?.userId;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;

          if (duration > this.slowQueryThreshold) {
            this.logger.warn(
              `SLOW QUERY: ${method} ${url} took ${duration}ms - user: ${String(userId || 'anonymous')}`,
            );
          } else if (duration > 500) {
            // Log moderate queries as debug
            this.logger.debug(
              `Request: ${method} ${url} - ${duration}ms - user: ${String(userId || 'anonymous')}`,
            );
          }
        },
        error: (err: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `FAILED REQUEST: ${method} ${url} - ${duration}ms - ${err.message} - user: ${String(userId || 'anonymous')}`,
          );
        },
      }),
    );
  }
}
