import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Charge } from './entities/charge.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Building } from '../buildings/entities/building.entity';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { ChargeType } from './enums/charge-type.enum';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(Charge)
    private chargesRepository: Repository<Charge>,
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
  ) {}

  async create(createChargeDto: CreateChargeDto): Promise<Charge> {
    const building = await this.buildingsRepository.findOne({
      where: { id: createChargeDto.buildingId },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${createChargeDto.buildingId} not found`);
    }

    const charge = this.chargesRepository.create({
      ...createChargeDto,
      building,
    });

    return this.chargesRepository.save(charge);
  }

  async findAll(buildingId?: string): Promise<Charge[]> {
    const where = buildingId ? { building: { id: buildingId } } : {};
    return this.chargesRepository.find({
      where,
      relations: ['building'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Charge> {
    const charge = await this.chargesRepository.findOne({
      where: { id },
      relations: ['building'],
    });

    if (!charge) {
      throw new NotFoundException(`Charge with ID ${id} not found`);
    }

    return charge;
  }

  async update(id: string, updateChargeDto: UpdateChargeDto): Promise<Charge> {
    const charge = await this.findOne(id);
    Object.assign(charge, updateChargeDto);
    return this.chargesRepository.save(charge);
  }

  async remove(id: string): Promise<void> {
    const charge = await this.findOne(id);
    await this.chargesRepository.remove(charge);
  }

  async calculateCharges(buildingId: string, year: number, month: number): Promise<any> {
    const building = await this.buildingsRepository.findOne({
      where: { id: buildingId },
      relations: ['apartments'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${buildingId} not found`);
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const charges = await this.chargesRepository.find({
      where: {
        building: { id: buildingId },
        date: Between(startDate, endDate),
      },
    });

    const totalSurface = building.apartments.reduce((sum, apt) => sum + apt.surface, 0);
    const chargesByApartment: Record<string, any> = {};

    for (const apartment of building.apartments) {
      const apartmentCharges = {
        apartmentId: apartment.id,
        apartmentNumber: apartment.number,
        surface: apartment.surface,
        charges: [] as Array<{
          type: ChargeType;
          description: string;
          amount: number;
        }>,
        total: 0,
      };

      for (const charge of charges) {
        let amount = 0;
        switch (charge.type) {
          case ChargeType.SURFACE:
            amount = (charge.amount * apartment.surface) / totalSurface;
            break;
          case ChargeType.FIXED:
            amount = charge.amount / building.apartments.length;
            break;
          case ChargeType.CUSTOM:
            amount = charge.amount * (apartment.surface / totalSurface);
            break;
        }

        apartmentCharges.charges.push({
          type: charge.type,
          description: charge.description,
          amount,
        });
        apartmentCharges.total += amount;
      }

      chargesByApartment[apartment.id] = apartmentCharges;
    }

    return {
      buildingId,
      period: { year, month },
      totalCharges: charges.reduce((sum, charge) => sum + charge.amount, 0),
      chargesByApartment,
    };
  }

  async getChargesByPeriod(buildingId: string, startDate: Date, endDate: Date): Promise<Charge[]> {
    return this.chargesRepository.find({
      where: {
        building: { id: buildingId },
        date: Between(startDate, endDate),
      },
      relations: ['building'],
      order: { date: 'DESC' },
    });
  }
} 