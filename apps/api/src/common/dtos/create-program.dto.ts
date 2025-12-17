import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { DegreeLevel } from '../enities/programs.entity';

export class CreateProgramDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() university: string;
  @IsString() @IsNotEmpty() country: string;

  @IsEnum(DegreeLevel) degreeLevel: DegreeLevel;

  @IsInt() @Min(0) tuition: number;

  @IsOptional() @IsArray() @IsString({ each: true })
  intakeMonths?: string[];

  @IsOptional()
  // keep it loose; validate in UI if needed
  requirements?: Record<string, any>;

  @IsOptional() @IsDateString()
  deadline?: string; // ISO date string; service will cast to Date
}
