import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEnum, IsUUID, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';
import { Apartment, ApartmentType } from '../entities/apartment.entity';

export class CreateApartmentDto extends BaseDto {
  @ApiProperty({ description: 'Numéro de l\'appartement' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ description: 'Surface en m²' })
  @IsNumber()
  @Min(0)
  surface: number;

  @ApiProperty({ description: 'Étage' })
  @IsNumber()
  @Min(-10)
  @Max(200)
  floor: number;

  @ApiProperty({ description: 'Type d\'appartement', enum: ApartmentType })
  @IsEnum(ApartmentType)
  type: ApartmentType;

  @ApiProperty({ description: 'ID du bâtiment' })
  @IsUUID()
  buildingId: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Prix de location', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentPrice?: number;

  @ApiProperty({ description: 'Charges mensuelles', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyCharges?: number;

  @ApiProperty({ description: 'État de l\'appartement', required: false })
  @IsOptional()
  @IsString()
  condition?: string;
}

export class UpdateApartmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  surface?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(-10)
  @Max(200)
  floor?: number;

  @ApiProperty({ required: false, enum: ApartmentType })
  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyCharges?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  condition?: string;
}

export class ApartmentResponseDto extends ResponseDto<CreateApartmentDto[]> {
  @ApiProperty({ type: [CreateApartmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateApartmentDto)
  declare data: CreateApartmentDto[];
}

export class ApartmentSearchDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSurface?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSurface?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(-10)
  @Max(200)
  floor?: number;

  @ApiProperty({ required: false, enum: ApartmentType })
  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  buildingId?: string;
}

export class ApartmentDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsNumber()
  floor: number;

  @ApiProperty()
  @IsNumber()
  surface: number;

  @ApiProperty()
  @IsNumber()
  rent: number;

  @ApiProperty()
  @IsNumber()
  provision: number;

  @ApiProperty()
  @IsBoolean()
  isOccupied: boolean;

  @ApiProperty()
  @IsEnum(ApartmentType)
  type: ApartmentType;

  @ApiProperty()
  @IsString()
  buildingId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ type: () => Apartment })
  building: Apartment;

  @ApiProperty({ type: () => Apartment, required: false })
  tenant?: Apartment;
} 