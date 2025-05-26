import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionKey } from './entities/distribution-key.entity';
import { Building } from '../buildings/entities/building.entity';
import { CreateDistributionKeyDto } from './dto/create-distribution-key.dto';
import { UpdateDistributionKeyDto } from './dto/update-distribution-key.dto';
import { DistributionKeyResponseDto } from './dto/distribution-key-response.dto';

@Injectable()
export class DistributionKeysService {
  constructor(
    @InjectRepository(DistributionKey)
    private distributionKeyRepository: Repository<DistributionKey>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}

  async create(createDistributionKeyDto: CreateDistributionKeyDto): Promise<DistributionKeyResponseDto> {
    const building = await this.buildingRepository.findOne({
      where: { id: createDistributionKeyDto.buildingId },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${createDistributionKeyDto.buildingId} not found`);
    }

    const distributionKey = this.distributionKeyRepository.create({
      ...createDistributionKeyDto,
      building,
    });

    const savedKey = await this.distributionKeyRepository.save(distributionKey);
    return this.mapToResponseDto(savedKey);
  }

  async findAll(buildingId?: string): Promise<DistributionKeyResponseDto[]> {
    const where = buildingId ? { building: { id: buildingId } } : {};
    const keys = await this.distributionKeyRepository.find({
      where,
      relations: ['building'],
    });
    return keys.map(key => this.mapToResponseDto(key));
  }

  async findOne(id: string): Promise<DistributionKeyResponseDto> {
    const key = await this.distributionKeyRepository.findOne({
      where: { id },
      relations: ['building'],
    });

    if (!key) {
      throw new NotFoundException(`Distribution key with ID ${id} not found`);
    }

    return this.mapToResponseDto(key);
  }

  async update(id: string, updateDistributionKeyDto: UpdateDistributionKeyDto): Promise<DistributionKeyResponseDto> {
    const key = await this.findOne(id);
    
    if (updateDistributionKeyDto.buildingId) {
      const building = await this.buildingRepository.findOne({
        where: { id: updateDistributionKeyDto.buildingId },
      });

      if (!building) {
        throw new NotFoundException(`Building with ID ${updateDistributionKeyDto.buildingId} not found`);
      }
    }

    Object.assign(key, updateDistributionKeyDto);
    const updatedKey = await this.distributionKeyRepository.save(key);
    return this.mapToResponseDto(updatedKey);
  }

  async remove(id: string): Promise<void> {
    const key = await this.distributionKeyRepository.findOne({
      where: { id },
      relations: ['building'],
    });
    
    if (!key) {
      throw new NotFoundException(`Distribution key with ID ${id} not found`);
    }
    
    await this.distributionKeyRepository.remove(key);
  }

  private mapToResponseDto(key: DistributionKey): DistributionKeyResponseDto {
    return {
      id: key.id,
      name: key.name,
      type: key.type,
      value: key.value,
      description: key.description,
      buildingId: key.building.id,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    };
  }
}