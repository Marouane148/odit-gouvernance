import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('apartments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  findAll(@Query('buildingId') buildingId?: string) {
    if (buildingId) {
      return this.apartmentsService.findByBuilding(buildingId);
    }
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  getApartmentStats(@Param('id') id: string) {
    return this.apartmentsService.getApartmentStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(id, updateApartmentDto);
  }

  @Patch(':id/provision')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  updateProvision(@Param('id') id: string, @Body('provision') provision: number) {
    return this.apartmentsService.updateProvision(id, provision);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(id);
  }
}