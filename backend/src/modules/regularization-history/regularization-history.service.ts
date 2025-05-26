import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegularizationHistory } from '../../entities/regularization-history.entity';

@Injectable()
export class RegularizationHistoryService {
  constructor(
    @InjectRepository(RegularizationHistory)
    private readonly historyRepository: Repository<RegularizationHistory>,
  ) {}

  async create(data: Partial<RegularizationHistory>): Promise<RegularizationHistory> {
    const history = this.historyRepository.create(data);
    return this.historyRepository.save(history);
  }

  async findAll(): Promise<RegularizationHistory[]> {
    return this.historyRepository.find({ order: { date: 'DESC' } });
  }
}