import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { DistributionKeysService } from './distribution-keys.service';
import { CreateDistributionKeyDto } from './dto/create-distribution-key.dto';
import { UpdateDistributionKeyDto } from './dto/update-distribution-key.dto';

@Controller('distribution-keys')
export class DistributionKeysController {
  constructor(private readonly service: DistributionKeysService) {}

  @Post()
  create(@Body() dto: CreateDistributionKeyDto) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDistributionKeyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}