import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepartitionKey } from './entities/repartition-key.entity';
import { Building } from '../buildings/entities/building.entity';
import { RepartitionKeysService } from './repartition-keys.service';
import { RepartitionKeysController } from './repartition-keys.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RepartitionKey, Building])],
  providers: [RepartitionKeysService],
  controllers: [RepartitionKeysController],
  exports: [RepartitionKeysService],
})
export class RepartitionKeysModule {} 