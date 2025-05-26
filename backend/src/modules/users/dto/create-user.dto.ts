import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @IsOptional()
  isEmailVerified?: boolean;

  @IsOptional()
  hasAcceptedTerms?: boolean;

  @IsOptional()
  termsAcceptedAt?: Date;

  @IsOptional()
  @IsString()
  termsVersion?: string;
} 