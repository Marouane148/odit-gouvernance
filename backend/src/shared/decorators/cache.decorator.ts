import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

export interface CacheOptions {
  key?: string;
  ttl?: number;
}

export const Cache = (options: CacheOptions = {}) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY, options.key || key)(target, key, descriptor);
    SetMetadata(CACHE_TTL, options.ttl)(target, key, descriptor);
    return descriptor;
  };
}; 