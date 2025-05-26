import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cache.service';
import { CustomLogger } from '../services/logger.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100; // 100 requêtes par fenêtre

  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('RateLimitMiddleware');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    let current = 0;
    try {
      current = await this.incrementCounter(key);
    } catch (error) {
      // En cas d'erreur de cache, continuer normalement
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - 1);
      return next();
    }

    // Ajout des headers de rate limiting
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - current));
    res.setHeader('X-RateLimit-Reset', this.getResetTime());

    if (current > this.maxRequests) {
      this.logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      return res.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
        error: 'Rate limit exceeded',
        retryAfter: this.getResetTime(),
      });
    }

    return next();
  }

  private getKey(req: Request): string {
    return `ratelimit:${req.ip}`;
  }

  private async incrementCounter(key: string): Promise<number> {
    const current = await this.cacheService.get<number>(key) || 0;
    await this.cacheService.set(key, current + 1, this.windowMs / 1000);
    return current + 1;
  }

  private getResetTime(): number {
    return Math.ceil(Date.now() / this.windowMs) * this.windowMs;
  }
} 