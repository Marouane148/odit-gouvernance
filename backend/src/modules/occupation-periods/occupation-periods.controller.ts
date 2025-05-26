import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { OccupationPeriodsService } from './occupation-periods.service';
import { CreateOccupationPeriodDto } from './dto/create-occupation-period.dto';
import { UpdateOccupationPeriodDto } from './dto/update-occupation-period.dto';

@Controller('occupation-periods')
export class OccupationPeriodsController {
  constructor(private readonly service: OccupationPeriodsService) {}

  @Post()
  create(@Body() dto: CreateOccupationPeriodDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOccupationPeriodDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}