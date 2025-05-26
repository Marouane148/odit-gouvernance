import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from './entities/building.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Charge } from '../charges/entities/charge.entity';
import { DistributionKey } from '../distribution-keys/entities/distribution-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Building,
      Apartment,
      Charge,
      DistributionKey,
    ]),
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
  exports: [BuildingsService],
})
export class BuildingsModule {}