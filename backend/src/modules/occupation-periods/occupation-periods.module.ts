import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccupationPeriodsService } from './occupation-periods.service';
import { OccupationPeriodsController } from './occupation-periods.controller';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Apartment } from '../apartments/entities/apartment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OccupationPeriod, Tenant, Apartment]),
  ],
  controllers: [OccupationPeriodsController],
  providers: [OccupationPeriodsService],
  exports: [OccupationPeriodsService],
})
export class OccupationPeriodsModule {}