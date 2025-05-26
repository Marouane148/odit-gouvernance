import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../shared/services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(CustomLogger)
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('HttpExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = this.createExceptionResponse({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name,
      details: exception.getResponse(),
    });

    // Log l'erreur avec le service de logging
    this.logger.error(
      `[${request.method}] ${request.url}`,
      exception.stack,
      {
        statusCode: status,
        error: exception.name,
        message: exception.message,
        details: exception.getResponse(),
      },
    );

    response.status(status).json(errorResponse);
  }

  createExceptionResponse(data: {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    message: string | null;
    error: string;
    details?: any;
  }) {
    return {
      statusCode: data.statusCode,
      timestamp: data.timestamp,
      path: data.path,
      method: data.method,
      message: data.message,
      error: data.error,
      details: data.details,
    };
  }
}