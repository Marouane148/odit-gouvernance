import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ChargeRegularizationService } from './charge-regularization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('charge-regularization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChargeRegularizationController {
  constructor(private readonly chargeRegularizationService: ChargeRegularizationService) {}

  @Get(':buildingId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  async calculateRegularization(
    @Param('buildingId') buildingId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.chargeRegularizationService.calculateRegularization(buildingId, year, month);
  }

  @Get('report')
  @Roles(UserRole.SUPER_ADMIN, UserRole.GESTIONNAIRE, UserRole.PROPRIETAIRE)
  generateReport(
    @Query('buildingId') buildingId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.chargeRegularizationService.generateRegularizationReport(buildingId, year, month);
  }
}