import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: { userId: number };
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  path: string;
  method: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);
    const error = this.extractError(exception, status);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    // Log based on severity
    const userId = request.user?.userId;
    const logContext = {
      userId,
      path: request.url,
      method: request.method,
      statusCode: status,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };

    if (status >= 500) {
      this.logger.error(
        `[${status}] ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        JSON.stringify(logContext),
      );
    } else if (status >= 400) {
      this.logger.warn(`[${status}] ${message}`, JSON.stringify(logContext));
    }

    response.status(status).json(errorResponse);
  }

  private extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        const msg = responseObj['message'];
        if (typeof msg === 'string') {
          return msg;
        }
        if (Array.isArray(msg)) {
          return msg.join(', ');
        }
        return exception.message;
      }
      return exception.message;
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return 'Une erreur interne est survenue';
  }

  private extractError(exception: unknown, status: number): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        const err = responseObj['error'];
        if (typeof err === 'string') {
          return err;
        }
        return this.getDefaultError(status);
      }
    }
    return this.getDefaultError(status);
  }

  private getDefaultError(status: number): string {
    const errors: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      408: 'Request Timeout',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
    };
    return errors[status] ?? 'Error';
  }
}
