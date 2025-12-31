import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Circuit Breaker Interceptor
 *
 * Prevents cascade failures when the database or external services become slow.
 * Opens the circuit after a threshold of failures, and resets after a timeout.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is open, requests are rejected immediately
 * - HALF_OPEN: Testing if the service has recovered
 */
@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CircuitBreakerInterceptor.name);

  private failureCount = 0;
  private lastFailureTime = 0;
  private isOpen = false;

  private readonly failureThreshold = 5; // Open circuit after 5 failures
  private readonly resetTimeout = 30000; // Reset after 30 seconds

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;

    // Check if circuit is open
    if (this.isOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.resetTimeout) {
        // Half-open state: allow one request through to test
        this.logger.log('Circuit breaker half-open, testing request...');
        this.isOpen = false;
        this.failureCount = 0;
      } else {
        this.logger.warn(
          `Circuit breaker OPEN - rejecting request: ${method} ${url}`,
        );
        throw new ServiceUnavailableException(
          'Service temporairement indisponible. Veuillez réessayer dans quelques instants.',
        );
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Successful request, reset failure count
        if (this.failureCount > 0) {
          this.logger.log('Circuit breaker: request successful, resetting');
        }
        this.failureCount = 0;
      }),
      catchError((err: Error) => {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        this.logger.error(
          `Circuit breaker: failure ${this.failureCount}/${this.failureThreshold} on ${method} ${url}`,
          err.stack,
        );

        if (this.failureCount >= this.failureThreshold) {
          this.isOpen = true;
          this.logger.error(
            `Circuit breaker OPENED after ${this.failureCount} failures`,
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
