import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepartitionKey } from './entities/repartition-key.entity';
import { CreateRepartitionKeyDto } from './dto/create-repartition-key.dto';
import { UpdateRepartitionKeyDto } from './dto/update-repartition-key.dto';

@Injectable()
export class RepartitionKeysService {
  constructor(
    @InjectRepository(RepartitionKey)
    private repartitionKeyRepository: Repository<RepartitionKey>,
  ) {}

  create(createRepartitionKeyDto: CreateRepartitionKeyDto) {
    const repartitionKey = this.repartitionKeyRepository.create(createRepartitionKeyDto);
    return this.repartitionKeyRepository.save(repartitionKey);
  }

  findAll() {
    return this.repartitionKeyRepository.find();
  }

  async findOne(id: string) {
    const repartitionKey = await this.repartitionKeyRepository.findOneBy({ id });
    if (!repartitionKey) {
      throw new NotFoundException(`Repartition key with ID ${id} not found`);
    }
    return repartitionKey;
  }

  async update(id: string, updateRepartitionKeyDto: UpdateRepartitionKeyDto) {
    await this.findOne(id);
    await this.repartitionKeyRepository.update(id, updateRepartitionKeyDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const repartitionKey = await this.findOne(id);
    return this.repartitionKeyRepository.remove(repartitionKey);
  }
} 