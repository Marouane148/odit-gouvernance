import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  findAll(@Query('apartmentId') apartmentId?: string) {
    if (apartmentId) {
      return this.tenantsService.findByApartment(apartmentId);
    }
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Put(':id/end-tenancy')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE)
  endTenancy(@Param('id') id: string, @Body('endDate') endDate: Date) {
    return this.tenantsService.endTenancy(id, endDate);
  }

  @Get('apartment/:apartmentId/history')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  getTenantHistory(@Param('apartmentId') apartmentId: string) {
    return this.tenantsService.getTenantHistory(apartmentId);
  }

  @Get('apartment/:apartmentId/current')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  getCurrentTenant(@Param('apartmentId') apartmentId: string) {
    return this.tenantsService.getCurrentTenant(apartmentId);
  }
}