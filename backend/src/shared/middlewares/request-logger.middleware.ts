import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from '../services/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext('RequestLogger');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    // Log de la requête entrante
    this.logger.log(`Incoming ${method} request to ${originalUrl} from ${ip}`, {
      method,
      url: originalUrl,
      ip,
      userAgent: req.get('user-agent'),
      body: this.sanitizeBody(req.body),
      query: req.query,
      params: req.params,
    });

    // Capture de la réponse
    const originalSend = res.send;
    res.send = (body) => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log de la réponse
      this.logger.log(`Response for ${method} ${originalUrl}`, {
        statusCode,
        responseTime: `${responseTime}ms`,
        body: this.sanitizeBody(body),
      });

      return originalSend.call(res, body);
    };

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
} 