import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { CreateOccupationPeriodDto } from './dto/create-occupation-period.dto';
import { UpdateOccupationPeriodDto } from './dto/update-occupation-period.dto';

@Injectable()
export class OccupationPeriodsService {
  constructor(
    @InjectRepository(OccupationPeriod)
    private occupationPeriodRepository: Repository<OccupationPeriod>,
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createOccupationPeriodDto: CreateOccupationPeriodDto): Promise<OccupationPeriod> {
    const apartment = await this.apartmentRepository.findOne({
      where: { id: createOccupationPeriodDto.apartmentId },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${createOccupationPeriodDto.apartmentId} not found`);
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: createOccupationPeriodDto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${createOccupationPeriodDto.tenantId} not found`);
    }

    const period = this.occupationPeriodRepository.create({
      startDate: new Date(createOccupationPeriodDto.startDate),
      endDate: createOccupationPeriodDto.endDate ? new Date(createOccupationPeriodDto.endDate) : null,
      notes: createOccupationPeriodDto.notes,
      apartment,
      tenant,
    });

    return this.occupationPeriodRepository.save(period);
  }

  async findAll(): Promise<OccupationPeriod[]> {
    return this.occupationPeriodRepository.find({
      relations: ['apartment', 'tenant'],
    });
  }

  async findOne(id: string): Promise<OccupationPeriod> {
    const period = await this.occupationPeriodRepository.findOne({
      where: { id },
      relations: ['apartment', 'tenant'],
    });

    if (!period) {
      throw new NotFoundException(`Occupation period with ID ${id} not found`);
    }

    return period;
  }

  async update(id: string, updateOccupationPeriodDto: UpdateOccupationPeriodDto): Promise<OccupationPeriod> {
    const period = await this.findOne(id);

    if (updateOccupationPeriodDto.startDate) {
      period.startDate = new Date(updateOccupationPeriodDto.startDate);
    }

    if (updateOccupationPeriodDto.endDate !== undefined) {
      period.endDate = updateOccupationPeriodDto.endDate ? new Date(updateOccupationPeriodDto.endDate) : null;
    }

    if (updateOccupationPeriodDto.notes !== undefined) {
      period.notes = updateOccupationPeriodDto.notes;
    }

    if (updateOccupationPeriodDto.apartmentId) {
      const apartment = await this.apartmentRepository.findOne({
        where: { id: updateOccupationPeriodDto.apartmentId },
      });

      if (!apartment) {
        throw new NotFoundException(`Apartment with ID ${updateOccupationPeriodDto.apartmentId} not found`);
      }

      period.apartment = apartment;
    }

    if (updateOccupationPeriodDto.tenantId) {
      const tenant = await this.tenantRepository.findOne({
        where: { id: updateOccupationPeriodDto.tenantId },
      });

      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${updateOccupationPeriodDto.tenantId} not found`);
      }

      period.tenant = tenant;
    }

    return this.occupationPeriodRepository.save(period);
  }

  async remove(id: string): Promise<void> {
    const period = await this.findOne(id);
    await this.occupationPeriodRepository.remove(period);
  }
}