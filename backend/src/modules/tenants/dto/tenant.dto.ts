import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID, IsArray, ValidateNested, IsDate, IsPhoneNumber, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';

export class CreateTenantDto extends BaseDto {
  @ApiProperty({ description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Téléphone' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: 'ID de l\'appartement' })
  @IsUUID()
  apartmentId: string;

  @ApiProperty({ description: 'Date de début du bail', type: Date })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'Date de fin du bail', type: Date, required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Contact d\'urgence', required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Nom du garant', required: false })
  @IsOptional()
  @IsString()
  guarantorName?: string;

  @ApiProperty({ description: 'Téléphone du garant', required: false })
  @IsOptional()
  @IsPhoneNumber()
  guarantorPhone?: string;

  @ApiProperty({ description: 'Email du garant', required: false })
  @IsOptional()
  @IsEmail()
  guarantorEmail?: string;

  @ApiProperty({ description: 'Actif', required: false, default: true })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class UpdateTenantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  apartmentId?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  guarantorName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  guarantorPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  guarantorEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class TenantResponseDto extends ResponseDto<CreateTenantDto[]> {
  @ApiProperty({ type: [CreateTenantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTenantDto)
  declare data: CreateTenantDto[];
}

export class TenantSearchDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  apartmentId?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
} 