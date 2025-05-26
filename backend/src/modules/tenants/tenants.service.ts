import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const apartment = await this.apartmentsRepository.findOne({
      where: { id: createTenantDto.apartmentId },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${createTenantDto.apartmentId} not found`);
    }

    // Vérifier si l'appartement a déjà un locataire actif
    const existingActiveTenant = await this.tenantsRepository.findOne({
      where: {
        apartment: { id: createTenantDto.apartmentId },
        isCurrent: true,
      },
    });

    if (existingActiveTenant) {
      throw new BadRequestException('This apartment already has an active tenant');
    }

    const tenant = this.tenantsRepository.create({
      firstName: createTenantDto.firstName,
      lastName: createTenantDto.lastName,
      email: createTenantDto.email,
      phone: createTenantDto.phone,
      startDate: createTenantDto.startDate,
      endDate: createTenantDto.endDate,
      emergencyContact: createTenantDto.emergencyContact,
      notes: createTenantDto.notes,
      guarantorName: createTenantDto.guarantorName,
      guarantorPhone: createTenantDto.guarantorPhone,
      guarantorEmail: createTenantDto.guarantorEmail,
      apartment,
      isCurrent: true,
    });

    return this.tenantsRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      relations: ['apartment', 'apartment.building'],
    });
  }

  async findByApartment(apartmentId: string): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      where: { apartment: { id: apartmentId } },
      relations: ['apartment'],
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
      relations: ['apartment', 'apartment.building'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    if (updateTenantDto.apartmentId) {
      const apartment = await this.apartmentsRepository.findOne({
        where: { id: updateTenantDto.apartmentId },
      });
      if (!apartment) {
        throw new NotFoundException(`Apartment with ID ${updateTenantDto.apartmentId} not found`);
      }
      tenant.apartment = apartment;
    }

    Object.assign(tenant, {
      ...updateTenantDto,
      apartment: tenant.apartment,
    });

    return this.tenantsRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantsRepository.remove(tenant);
  }

  async endTenancy(id: string, endDate: Date): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    if (!tenant.isCurrent) {
      throw new BadRequestException('This tenant is already inactive');
    }

    tenant.endDate = endDate;
    tenant.isCurrent = false;
    return this.tenantsRepository.save(tenant);
  }

  async getTenantHistory(apartmentId: string): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      where: { apartment: { id: apartmentId } },
      relations: ['apartment'],
      order: { startDate: 'DESC' },
    });
  }

  async getCurrentTenant(apartmentId: string): Promise<Tenant | null> {
    return this.tenantsRepository.findOne({
      where: {
        apartment: { id: apartmentId },
        isCurrent: true,
      },
      relations: ['apartment'],
    });
  }
}