import { IsString, IsDate, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  managementStartDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  managementEndDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}