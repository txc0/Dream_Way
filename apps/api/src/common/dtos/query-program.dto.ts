import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DegreeLevel } from '../enities/programs.entity';

export class QueryProgramsDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsEnum(DegreeLevel) degreeLevel?: DegreeLevel;
  @IsOptional() @IsInt() @Min(0) minTuition?: number;
  @IsOptional() @IsInt() @Min(0) maxTuition?: number;
  @IsOptional() @IsString() intakeMonth?: string;
}
