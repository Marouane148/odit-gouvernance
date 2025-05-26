import { IsString, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { RepartitionKeyType } from '../enums/repartition-key-type.enum';

export class CreateRepartitionKeyDto {
  @IsString()
  name: string;

  @IsEnum(RepartitionKeyType)
  type: RepartitionKeyType;

  @IsNumber()
  value: number;

  @IsUUID()
  buildingId: string;
} 