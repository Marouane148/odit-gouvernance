import { ApiProperty } from '@nestjs/swagger';
import { DistributionKeyType } from '../entities/distribution-key.entity';

export class DistributionKeyResponseDto {
  @ApiProperty({ description: 'ID de la clé de répartition' })
  id: string;

  @ApiProperty({ description: 'Nom de la clé de répartition' })
  name: string;

  @ApiProperty({ 
    description: 'Type de répartition',
    enum: DistributionKeyType
  })
  type: DistributionKeyType;

  @ApiProperty({ description: 'Valeur de la clé de répartition' })
  value: number;

  @ApiProperty({ description: 'Description de la clé de répartition', required: false })
  description?: string;

  @ApiProperty({ description: 'ID du bâtiment associé' })
  buildingId: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
} 