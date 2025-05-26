import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Building } from '../buildings/entities/building.entity';
import { RegularizationResult } from './interfaces/regularization-result.interface';
import { Charge } from '../charges/entities/charge.entity';
import { ChargeType } from '../charges/enums/charge-type.enum';

@Injectable()
export class ChargeRegularizationService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(OccupationPeriod)
    private occupationPeriodRepository: Repository<OccupationPeriod>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Charge)
    private chargeRepository: Repository<Charge>,
  ) {}

  async calculateRegularization(buildingId: string, year: number, month: number): Promise<RegularizationResult[]> {
    const building = await this.buildingRepository.findOne({
      where: { id: buildingId },
      relations: ['apartments'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${buildingId} not found`);
    }

    const results: RegularizationResult[] = [];

    for (const apartment of building.apartments) {
      const currentTenant = await this.occupationPeriodRepository.findOne({
        where: {
          apartment: { id: apartment.id },
          endDate: IsNull(),
        },
        relations: ['tenant'],
      });

      if (currentTenant) {
        results.push({
          apartmentId: apartment.id,
          tenantId: currentTenant.tenant.id,
          tenantName: `${currentTenant.tenant.firstName} ${currentTenant.tenant.lastName}`,
          amount: 0, // À calculer selon vos règles métier
          period: {
            startDate: currentTenant.startDate,
            endDate: currentTenant.endDate,
          },
        });
      }
    }

    return results;
  }

  async generateRegularizationReport(buildingId: string, year: number, month: number) {
    const results = await this.calculateRegularization(buildingId, year, month);
    const building = await this.buildingRepository.findOne({
      where: { id: buildingId },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${buildingId} not found`);
    }

    return {
      buildingId,
      buildingName: building.name,
      period: { year, month },
      totalCharges: results.reduce((sum, result) => sum + result.amount, 0),
      details: results.reduce((acc, result) => {
        if (!acc[result.apartmentId]) {
          acc[result.apartmentId] = {
            apartmentId: result.apartmentId,
            tenantName: result.tenantName,
            total: 0,
            charges: [],
          };
        }
        acc[result.apartmentId].charges.push({
          amount: result.amount,
        });
        acc[result.apartmentId].total += result.amount;
        return acc;
      }, {}),
    };
  }
}