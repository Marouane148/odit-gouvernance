import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID, IsArray, ValidateNested, IsEnum, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, ResponseDto } from '../../../shared/dto/base.dto';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export class CreateUserDto extends BaseDto {
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

  @ApiProperty({ description: 'Mot de passe' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
  })
  password: string;

  @ApiProperty({ description: 'Rôle', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'Téléphone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Adresse', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Actif', required: false, default: true })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class UpdateUserDto {
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
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
  })
  password?: string;

  @ApiProperty({ required: false, enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class UserResponseDto extends ResponseDto<CreateUserDto[]> {
  @ApiProperty({ type: [CreateUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  declare data: CreateUserDto[];
}

export class UserSearchDto extends BaseDto {
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

  @ApiProperty({ required: false, enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class LoginDto {
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mot de passe' })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Ancien mot de passe' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
  })
  newPassword: string;

  @ApiProperty({ description: 'Confirmation du nouveau mot de passe' })
  @IsString()
  confirmPassword: string;
} 