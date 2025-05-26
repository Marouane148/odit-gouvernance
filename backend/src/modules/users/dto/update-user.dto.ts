import { IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAcceptedTerms?: boolean;

  @IsOptional()
  termsAcceptedAt?: Date;

  @IsOptional()
  @IsString()
  termsVersion?: string;
} 