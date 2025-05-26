import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../../entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingsRepository.create(createBuildingDto);
    return this.buildingsRepository.save(building);
  }

  async findAll(): Promise<Building[]> {
    return this.buildingsRepository.find({
      relations: ['apartments', 'distributionKeys'],
    });
  }

  async findOne(id: string): Promise<Building> {
    const building = await this.buildingsRepository.findOne({
      where: { id },
      relations: ['apartments', 'distributionKeys'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    const building = await this.findOne(id);
    Object.assign(building, updateBuildingDto);
    return this.buildingsRepository.save(building);
  }

  async remove(id: string): Promise<void> {
    const building = await this.findOne(id);
    await this.buildingsRepository.remove(building);
  }

  async getBuildingStats(id: string) {
    const building = await this.findOne(id);
    const totalApartments = building.apartments.length;
    const totalSurface = building.apartments.reduce((sum, apt) => sum + apt.surface, 0);
    const occupiedApartments = building.apartments.filter(apt => apt.isOccupied).length;

    return {
      totalApartments,
      totalSurface,
      occupiedApartments,
      occupancyRate: (occupiedApartments / totalApartments) * 100,
    };
  }
}