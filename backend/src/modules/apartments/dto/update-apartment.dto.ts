import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateApartmentDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsNumber()
  @IsOptional()
  surface?: number;

  @IsString()
  @IsOptional()
  description?: string;
}