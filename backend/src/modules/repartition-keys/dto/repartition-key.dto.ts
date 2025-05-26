import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEnum, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';

export enum RepartitionKeyType {
  SURFACE = 'SURFACE',
  EQUAL = 'EQUAL',
  CUSTOM = 'CUSTOM',
  FLOOR = 'FLOOR',
  ROOMS = 'ROOMS',
  OCCUPANTS = 'OCCUPANTS'
}

export class CreateRepartitionKeyDto extends BaseDto {
  @ApiProperty({ description: 'Nom de la clé de répartition' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Type de clé de répartition', enum: RepartitionKeyType })
  @IsEnum(RepartitionKeyType)
  type: RepartitionKeyType;

  @ApiProperty({ description: 'Valeur de la clé de répartition' })
  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @ApiProperty({ description: 'ID du bâtiment' })
  @IsUUID()
  buildingId: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Formule de calcul', required: false })
  @IsOptional()
  @IsString()
  formula?: string;

  @ApiProperty({ description: 'Actif', required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class UpdateRepartitionKeyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, enum: RepartitionKeyType })
  @IsOptional()
  @IsEnum(RepartitionKeyType)
  type?: RepartitionKeyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  value?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  formula?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class RepartitionKeyResponseDto extends ResponseDto<CreateRepartitionKeyDto[]> {
  @ApiProperty({ type: [CreateRepartitionKeyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepartitionKeyDto)
  declare data: CreateRepartitionKeyDto[];
}

export class RepartitionKeySearchDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, enum: RepartitionKeyType })
  @IsOptional()
  @IsEnum(RepartitionKeyType)
  type?: RepartitionKeyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
} 