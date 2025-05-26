import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { CacheService } from '../services/cache.service';
import { CustomLogger } from '../services/logger.service';
import { Request, Response } from 'express';

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;
  let cacheService: CacheService;
  let logger: CustomLogger;

  const mockRequest = {
    ip: '127.0.0.1',
  } as Request;

  const mockResponse = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn();

  beforeEach(async () => {
    mockNext.mockClear();
    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitMiddleware,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    middleware = module.get<RateLimitMiddleware>(RateLimitMiddleware);
    cacheService = module.get(CacheService);
    logger = module.get(CustomLogger);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should allow request when under rate limit', async () => {
      const currentCount = 50;
      (cacheService.get as jest.Mock).mockResolvedValue(currentCount);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 100);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 49);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should block request when over rate limit', async () => {
      const currentCount = 101;
      (cacheService.get as jest.Mock).mockResolvedValue(currentCount);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Too Many Requests',
        error: 'Rate limit exceeded',
        retryAfter: expect.any(Number),
      });
      expect(logger.warn).toHaveBeenCalledWith('Rate limit exceeded for IP: 127.0.0.1');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle cache errors gracefully', async () => {
      (cacheService.get as jest.Mock).mockRejectedValue(new Error('Cache error'));
      (cacheService.set as jest.Mock).mockResolvedValue(undefined);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 100);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 99);
      expect(mockNext).toHaveBeenCalled();
    });
  });
}); 