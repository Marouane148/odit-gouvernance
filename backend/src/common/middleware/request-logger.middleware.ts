import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLogger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const { statusCode } = res;

      // Ne logger que les requêtes importantes
      if (statusCode >= 400) {
        console.error(`[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms`);
      } else if (method !== 'GET' || originalUrl.includes('/api/')) {
        console.log(`[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms`);
      }
    });

    next();
  }
} 