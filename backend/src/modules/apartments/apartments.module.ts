import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { Building } from '../buildings/entities/building.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apartment, Building, Tenant, OccupationPeriod]),
    TenantsModule
  ],
  providers: [ApartmentsService],
  controllers: [ApartmentsController],
  exports: [ApartmentsService],
})
export class ApartmentsModule {}





