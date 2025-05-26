import { IsString, IsNumber, IsUUID, IsDate, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ChargeType } from '../enums/charge-type.enum';

export class CreateChargeDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(ChargeType)
  type: ChargeType;

  @IsUUID()
  buildingId: string;
} 