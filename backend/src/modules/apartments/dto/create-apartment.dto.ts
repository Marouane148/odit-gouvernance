import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApartmentType } from '../entities/apartment.entity';

export class CreateApartmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  floor: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  surface: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  rent: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  provision: number;

  @ApiProperty()
  @IsEnum(ApartmentType)
  type: ApartmentType;

  @ApiProperty()
  @IsUUID()
  buildingId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  tenantId?: string;
}