import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomLogger } from './services/logger.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [CustomLogger, CacheService],
  exports: [CustomLogger, CacheService],
})
export class SharedModule {} 