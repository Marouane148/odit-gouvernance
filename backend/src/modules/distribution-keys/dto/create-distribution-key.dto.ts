import { IsString, IsNumber, IsUUID, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DistributionKeyType } from '../entities/distribution-key.entity';

export class CreateDistributionKeyDto {
  @ApiProperty({ description: 'Nom de la clé de répartition' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Type de répartition',
    enum: DistributionKeyType,
    example: DistributionKeyType.SURFACE
  })
  @IsEnum(DistributionKeyType)
  type: DistributionKeyType;

  @ApiProperty({ description: 'Valeur de la clé de répartition' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Description de la clé de répartition', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID du bâtiment associé' })
  @IsUUID()
  buildingId: string;
}