import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Role } from '../enities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
