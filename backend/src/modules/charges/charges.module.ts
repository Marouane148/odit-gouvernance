import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from './entities/charge.entity';
import { Building } from '../buildings/entities/building.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Charge, Building, Apartment])],
  providers: [ChargesService],
  controllers: [ChargesController],
  exports: [ChargesService],
})
export class ChargesModule {} 