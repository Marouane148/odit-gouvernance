import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegularizationHistoryService } from './regularization-history.service';
import { RegularizationHistory } from '../../entities/regularization-history.entity';

@Controller('regularization-history')
export class RegularizationHistoryController {
  constructor(private readonly historyService: RegularizationHistoryService) {}

  @Post()
  async create(@Body() data: Partial<RegularizationHistory>): Promise<RegularizationHistory> {
    return this.historyService.create(data);
  }

  @Get()
  async findAll(): Promise<RegularizationHistory[]> {
    return this.historyService.findAll();
  }
}