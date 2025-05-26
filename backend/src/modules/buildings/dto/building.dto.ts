import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';

export class CreateBuildingDto extends BaseDto {
  @ApiProperty({ description: 'Nom du bâtiment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Adresse du bâtiment' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Date de début de gestion', type: Date })
  @IsDate()
  @Type(() => Date)
  managementStartDate: Date;

  @ApiProperty({ description: 'Date de fin de gestion', type: Date, required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  managementEndDate?: Date;

  @ApiProperty({ description: 'Description du bâtiment', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nombre total d\'étages', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  totalFloors?: number;

  @ApiProperty({ description: 'Année de construction', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  constructionYear?: number;

  @ApiProperty({ description: 'Surface totale en m²', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSurface?: number;
}

export class UpdateBuildingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  managementStartDate?: Date;

  @ApiProperty({ description: 'Date de fin de gestion', type: Date, required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  managementEndDate?: Date;

  @ApiProperty({ description: 'Description du bâtiment', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nombre total d\'étages', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  totalFloors?: number;

  @ApiProperty({ description: 'Année de construction', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  constructionYear?: number;

  @ApiProperty({ description: 'Surface totale en m²', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSurface?: number;
}

export class BuildingResponseDto extends ResponseDto<CreateBuildingDto[]> {
  @ApiProperty({ type: [CreateBuildingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBuildingDto)
  declare data: CreateBuildingDto[];
}

export class BuildingSearchDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  managementStartDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  managementEndDate?: Date;
} 