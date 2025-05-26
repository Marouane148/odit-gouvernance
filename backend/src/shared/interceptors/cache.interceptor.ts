import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../services/cache.service';
import { CACHE_KEY, CACHE_TTL } from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.getCacheKey(context);
    const ttl = this.getCacheTTL(context);

    if (!cacheKey) {
      return next.handle();
    }

    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(cacheKey, data, ttl);
      }),
    );
  }

  private getCacheKey(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY,
      context.getHandler(),
    );

    if (!cacheKey) {
      return undefined;
    }

    const request = context.switchToHttp().getRequest();
    return `${cacheKey}:${request.method}:${request.url}`;
  }

  private getCacheTTL(context: ExecutionContext): number | undefined {
    return this.reflector.get<number>(
      CACHE_TTL,
      context.getHandler(),
    );
  }
} 