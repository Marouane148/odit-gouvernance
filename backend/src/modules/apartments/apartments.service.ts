import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './entities/apartment.entity';
import { Building } from '../../entities/building.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { OccupationPeriod } from '../tenants/entities/occupation-period.entity';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApartmentType } from '../../modules/apartments/entities/apartment.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(OccupationPeriod)
    private occupationPeriodRepository: Repository<OccupationPeriod>,
  ) {}

  async create(createApartmentDto: CreateApartmentDto): Promise<Apartment> {
    const building = await this.buildingRepository.findOne({
      where: { id: createApartmentDto.buildingId },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${createApartmentDto.buildingId} not found`);
    }

    // Vérifier si le numéro d'appartement existe déjà dans l'immeuble
    const existingApartment = await this.apartmentRepository.findOne({
      where: {
        number: createApartmentDto.number,
        building: { id: createApartmentDto.buildingId },
      },
    });

    if (existingApartment) {
      throw new BadRequestException(`Apartment number ${createApartmentDto.number} already exists in this building`);
    }

    const apartment = this.apartmentRepository.create({
      ...createApartmentDto,
      building: { id: createApartmentDto.buildingId },
      buildingId: createApartmentDto.buildingId,
      type: createApartmentDto.type as ApartmentType,
    });

    return this.apartmentRepository.save(apartment);
  }

  async findAll(): Promise<Apartment[]> {
    return this.apartmentRepository.find({
      relations: ['building', 'tenant', 'occupationPeriods'],
    });
  }

  async findByBuilding(buildingId: string): Promise<Apartment[]> {
    return this.apartmentRepository.find({
      where: { building: { id: buildingId } },
      relations: ['tenant'],
    });
  }

  async findOne(id: string): Promise<Apartment> {
    const apartment = await this.apartmentRepository.findOne({
      where: { id },
      relations: ['building', 'tenant', 'occupationPeriods'],
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    return apartment;
  }

  async update(id: string, updateApartmentDto: UpdateApartmentDto): Promise<Apartment> {
    const apartment = await this.findOne(id);
    
    Object.assign(apartment, updateApartmentDto);
    
    return this.apartmentRepository.save(apartment);
  }

  async remove(id: string): Promise<void> {
    const apartment = await this.findOne(id);
    await this.apartmentRepository.remove(apartment);
  }

  async getApartmentStats(id: string) {
    const apartment = await this.findOne(id);
    const currentTenant = apartment.tenant;
    
    if (!currentTenant) {
      return {
        isOccupied: false,
        currentTenant: null,
        occupationPeriod: null,
      };
    }

    const currentPeriod = await this.occupationPeriodRepository.findOne({
      where: {
        apartmentId: id,
        tenantId: currentTenant.id,
      },
      order: { startDate: 'DESC' },
    });

    return {
      isOccupied: true,
      currentTenant: {
        id: currentTenant.id,
        firstName: currentTenant.firstName,
        lastName: currentTenant.lastName,
        email: currentTenant.email,
        phone: currentTenant.phone,
      },
      occupationPeriod: currentPeriod ? {
        startDate: currentPeriod.startDate,
        endDate: currentPeriod.endDate,
      } : null,
    };
  }

  async updateProvision(id: string, provision: number): Promise<Apartment> {
    const apartment = await this.findOne(id);
    apartment.provision = provision;
    return this.apartmentRepository.save(apartment);
  }
}