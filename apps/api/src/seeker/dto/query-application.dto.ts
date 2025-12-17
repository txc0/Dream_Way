// src/seeker/dto/query-applications.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { AppStatus } from '../entities/application.entity';
export class QueryApplicationsDto {
  @IsOptional() @IsEnum(AppStatus)
  status?: AppStatus;
}
