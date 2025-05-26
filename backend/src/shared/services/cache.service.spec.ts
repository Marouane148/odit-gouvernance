import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CustomLogger } from './logger.service';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;
  let logger: CustomLogger;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
    logger = module.get(CustomLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return cached value when it exists', async () => {
      const testKey = 'test-key';
      const testValue = { data: 'test' };
      cacheManager.get.mockResolvedValue(testValue);

      const result = await service.get(testKey);

      expect(result).toEqual(testValue);
      expect(cacheManager.get).toHaveBeenCalledWith(testKey);
      expect(logger.debug).toHaveBeenCalledWith(`Cache hit for key: ${testKey}`);
    });

    it('should return null when cache miss', async () => {
      const testKey = 'test-key';
      cacheManager.get.mockResolvedValue(null);

      const result = await service.get(testKey);

      expect(result).toBeNull();
      expect(logger.debug).toHaveBeenCalledWith(`Cache miss for key: ${testKey}`);
    });

    it('should handle errors gracefully', async () => {
      const testKey = 'test-key';
      const error = new Error('Cache error');
      cacheManager.get.mockRejectedValue(error);

      const result = await service.get(testKey);

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        `Error getting cache for key: ${testKey}`,
        error.stack,
      );
    });
  });

  describe('set', () => {
    it('should set cache value successfully', async () => {
      const testKey = 'test-key';
      const testValue = { data: 'test' };
      const ttl = 3600;

      await service.set(testKey, testValue, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(testKey, testValue, ttl);
      expect(logger.debug).toHaveBeenCalledWith(
        `Cache set for key: ${testKey} with TTL: ${ttl}s`,
      );
    });

    it('should handle errors when setting cache', async () => {
      const testKey = 'test-key';
      const testValue = { data: 'test' };
      const error = new Error('Cache error');
      cacheManager.set.mockRejectedValue(error);

      await service.set(testKey, testValue);

      expect(logger.error).toHaveBeenCalledWith(
        `Error setting cache for key: ${testKey}`,
        error.stack,
      );
    });
  });

  describe('del', () => {
    it('should delete cache value successfully', async () => {
      const testKey = 'test-key';

      await service.del(testKey);

      expect(cacheManager.del).toHaveBeenCalledWith(testKey);
      expect(logger.debug).toHaveBeenCalledWith(`Cache deleted for key: ${testKey}`);
    });

    it('should handle errors when deleting cache', async () => {
      const testKey = 'test-key';
      const error = new Error('Cache error');
      cacheManager.del.mockRejectedValue(error);

      await service.del(testKey);

      expect(logger.error).toHaveBeenCalledWith(
        `Error deleting cache for key: ${testKey}`,
        error.stack,
      );
    });
  });
}); 