import { IsString, IsEmail, IsUUID, IsDate, IsOptional, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTenantDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsUUID()
  apartmentId: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  guarantorName?: string;

  @IsPhoneNumber()
  @IsOptional()
  guarantorPhone?: string;

  @IsEmail()
  @IsOptional()
  guarantorEmail?: string;
}