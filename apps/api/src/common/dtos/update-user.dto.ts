import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Role } from '../enities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsAlpha()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
