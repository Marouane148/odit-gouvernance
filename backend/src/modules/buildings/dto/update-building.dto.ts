import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class UpdateBuildingDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDate()
  @IsOptional()
  managementStartDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}