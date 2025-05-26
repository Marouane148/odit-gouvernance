import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargeRegularizationService } from './charge-regularization.service';
import { ChargeRegularizationController } from './charge-regularization.controller';
import { Charge } from '../charges/entities/charge.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { Building } from '../buildings/entities/building.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Charge,
      Apartment,
      Tenant,
      OccupationPeriod,
      Building,
    ]),
  ],
  controllers: [ChargeRegularizationController],
  providers: [ChargeRegularizationService],
})
export class ChargeRegularizationModule {}