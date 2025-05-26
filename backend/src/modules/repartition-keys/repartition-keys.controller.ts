import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepartitionKeysService } from './repartition-keys.service';
import { CreateRepartitionKeyDto } from './dto/create-repartition-key.dto';
import { UpdateRepartitionKeyDto } from './dto/update-repartition-key.dto';

@Controller('repartition-keys')
export class RepartitionKeysController {
  constructor(private readonly repartitionKeysService: RepartitionKeysService) {}

  @Post()
  create(@Body() createRepartitionKeyDto: CreateRepartitionKeyDto) {
    return this.repartitionKeysService.create(createRepartitionKeyDto);
  }

  @Get()
  findAll() {
    return this.repartitionKeysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repartitionKeysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepartitionKeyDto: UpdateRepartitionKeyDto) {
    return this.repartitionKeysService.update(id, updateRepartitionKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repartitionKeysService.remove(id);
  }
} 