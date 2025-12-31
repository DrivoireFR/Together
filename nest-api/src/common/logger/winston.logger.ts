import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

interface LogInfo {
  timestamp?: string;
  level: string;
  message: string;
  context?: string;
  trace?: string;
}

// Format for development (readable)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const logInfo = info as LogInfo;
    const ctx = logInfo.context ?? 'Application';
    const traceStr = logInfo.trace ? `\n${logInfo.trace}` : '';
    return `${String(logInfo.timestamp)} [${ctx}] ${logInfo.level}: ${logInfo.message}${traceStr}`;
  }),
);

// Format for production (JSON)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

// Transport for rotating files (production)
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m', // 50 MB max per file
  maxFiles: 5, // Keep 5 files max (250 MB total)
  zippedArchive: true, // Compress old files
});

// Separate transport for errors
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: 5,
  zippedArchive: true,
  level: 'error',
});

// Console transport
const consoleTransport = new winston.transports.Console({
  format: isProduction ? prodFormat : devFormat,
});

// Create winston logger instance
const winstonLogger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: isProduction ? prodFormat : devFormat,
  transports: isProduction
    ? [consoleTransport, fileRotateTransport, errorFileTransport]
    : [consoleTransport],
  exitOnError: false,
});

/**
 * Custom Winston Logger Service for NestJS
 * Implements the LoggerService interface for seamless integration
 */
export class WinstonLoggerService implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    winstonLogger.info(message, { context: context ?? this.context });
  }

  error(message: string, trace?: string, context?: string) {
    winstonLogger.error(message, {
      context: context ?? this.context,
      trace,
    });
  }

  warn(message: string, context?: string) {
    winstonLogger.warn(message, { context: context ?? this.context });
  }

  debug(message: string, context?: string) {
    winstonLogger.debug(message, { context: context ?? this.context });
  }

  verbose(message: string, context?: string) {
    winstonLogger.verbose(message, { context: context ?? this.context });
  }
}

// Export singleton instance
export const winstonLoggerService = new WinstonLoggerService();
