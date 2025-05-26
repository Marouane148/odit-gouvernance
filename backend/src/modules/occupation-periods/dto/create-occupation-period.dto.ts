import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOccupationPeriodDto {
  @ApiProperty({ description: 'ID du locataire' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'ID de l\'appartement' })
  @IsUUID()
  apartmentId: string;

  @ApiProperty({ description: 'Date de début de la période' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Date de fin de la période', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Notes sur la période', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}