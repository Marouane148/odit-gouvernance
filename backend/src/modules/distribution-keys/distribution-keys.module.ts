import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributionKeysService } from './distribution-keys.service';
import { DistributionKeysController } from './distribution-keys.controller';
import { DistributionKey } from './entities/distribution-key.entity';
import { Building } from '../buildings/entities/building.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DistributionKey,
      Building,
    ]),
  ],
  controllers: [DistributionKeysController],
  providers: [DistributionKeysService],
  exports: [DistributionKeysService],
})
export class DistributionKeysModule {}