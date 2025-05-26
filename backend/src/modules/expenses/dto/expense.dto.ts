import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum, IsUUID, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';

export enum ExpenseType {
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  UTILITY = 'UTILITY',
  INSURANCE = 'INSURANCE',
  TAX = 'TAX',
  SALARY = 'SALARY',
  SUPPLIES = 'SUPPLIES',
  OTHER = 'OTHER'
}

export class CreateExpenseDto extends BaseDto {
  @ApiProperty({ description: 'Type de dépense', enum: ExpenseType })
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @ApiProperty({ description: 'Montant de la dépense' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Date de la dépense', type: Date })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Description de la dépense' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Numéro de facture', required: false })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ description: 'Fichier de facture', required: false })
  @IsOptional()
  @IsString()
  invoiceFile?: string;

  @ApiProperty({ description: 'ID du bâtiment' })
  @IsUUID()
  buildingId: string;

  @ApiProperty({ description: 'Catégorie de dépense', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Fournisseur', required: false })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ description: 'Méthode de paiement', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class UpdateExpenseDto {
  @ApiProperty({ required: false, enum: ExpenseType })
  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  invoiceFile?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class ExpenseResponseDto extends ResponseDto<CreateExpenseDto[]> {
  @ApiProperty({ type: [CreateExpenseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  declare data: CreateExpenseDto[];
}

export class ExpenseSearchDto extends BaseDto {
  @ApiProperty({ required: false, enum: ExpenseType })
  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

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
  @IsUUID()
  buildingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplier?: string;
} 