import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CustomLogger } from './logger.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('CacheService');
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        this.logger.debug(`Cache hit for key: ${key}`);
      } else {
        this.logger.debug(`Cache miss for key: ${key}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Error getting cache for key: ${key}`, error.stack);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache set for key: ${key}${ttl ? ` with TTL: ${ttl}s` : ''}`);
    } catch (error) {
      this.logger.error(`Error setting cache for key: ${key}`, error.stack);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key: ${key}`, error.stack);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheManager.del('*');
      this.logger.debug('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache', error.stack);
    }
  }
} 